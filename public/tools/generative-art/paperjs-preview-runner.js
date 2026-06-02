(function () {
    function findCode(canvas) {
        var content = canvas.closest(".content") || document;
        var code = content.querySelector(".code-block code");
        return code ? code.textContent.replace(/\n$/, "").trim() : "";
    }

    function makeStubElement(element) {
        return {
            value: element.getAttribute("value") || "",
            checked: element.hasAttribute("checked"),
            style: {},
            _listeners: {},
            addEventListener: function (name, handler) {
                this._listeners[name] = handler;
            },
            removeEventListener: function (name) {
                delete this._listeners[name];
            },
            dispatchEvent: function (event) {
                var handler = this._listeners[event.type] || this["on" + event.type];
                if (handler) handler.call(this, event);
            },
            getAttribute: function (name) {
                return element.getAttribute(name);
            },
            setAttribute: function (name, value) {
                if (name === "value") this.value = value;
                element.setAttribute(name, value);
            }
        };
    }

    function collectStubElements(doc) {
        var stubs = {};
        Array.prototype.forEach.call(doc.querySelectorAll("[id]"), function (element) {
            var id = element.getAttribute("id");
            if (id && id !== "canvas") stubs[id] = makeStubElement(element);
        });
        return stubs;
    }

    function collectDomHtml(doc) {
        var body = doc.body && doc.body.cloneNode(true);
        if (!body) return "";

        Array.prototype.forEach.call(body.querySelectorAll("script, canvas"), function (element) {
            element.parentNode.removeChild(element);
        });

        return body.innerHTML.trim();
    }

    function parseSource(source) {
        if (!/<(?:!doctype|html|head|body|script|canvas|input)\b/i.test(source)) {
            return { mode: "paperscript", code: source, stubs: {}, domHtml: "" };
        }

        var doc = new DOMParser().parseFromString(source, "text/html");
        var paperScripts = Array.prototype.filter.call(
            doc.querySelectorAll('script[type="text/paperscript"], script[type="text/x-paperscript"]'),
            function (script) { return script.textContent.trim(); }
        );

        if (paperScripts.length) {
            return {
                mode: "paperscript",
                code: paperScripts.map(function (script) { return script.textContent; }).join("\n"),
                stubs: collectStubElements(doc),
                domHtml: collectDomHtml(doc)
            };
        }

        var jsScripts = Array.prototype.filter.call(
            doc.querySelectorAll("script:not([src])"),
            function (script) { return script.textContent.trim(); }
        );

        if (jsScripts.length) {
            return {
                mode: "javascript",
                code: jsScripts.map(function (script) { return script.textContent; }).join("\n"),
                stubs: collectStubElements(doc),
                domHtml: collectDomHtml(doc)
            };
        }

        return { mode: "paperscript", code: source, stubs: collectStubElements(doc), domHtml: collectDomHtml(doc) };
    }

    function findMountedById(mounted, id) {
        if (!mounted) return null;
        var elements = mounted.querySelectorAll("[id]");
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].id === id) return elements[i];
        }
        return null;
    }

    function mountDom(parsed) {
        if (!parsed.domHtml) return null;

        var wrapper = document.createElement("div");
        wrapper.className = "paperjs-preview-source-dom";
        wrapper.setAttribute("aria-hidden", "true");
        wrapper.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;opacity:0;pointer-events:none;";
        wrapper.innerHTML = parsed.domHtml;
        document.body.appendChild(wrapper);
        return wrapper;
    }

    function makePreviewDocument(canvas, stubs, mounted) {
        return {
            getElementById: function (id) {
                if (id === "canvas") return canvas;
                var mountedElement = findMountedById(mounted, id);
                if (mountedElement) return mountedElement;
                return stubs[id] || document.getElementById(id);
            },
            querySelector: function (selector) {
                if (selector === "#canvas" || selector === "canvas") return canvas;
                if (selector.charAt(0) === "#") return stubs[selector.slice(1)] || document.querySelector(selector);
                return document.querySelector(selector);
            },
            addEventListener: function (name, handler) {
                document.addEventListener(name, handler);
            },
            removeEventListener: function (name, handler) {
                document.removeEventListener(name, handler);
            }
        };
    }

    function makeDollar(canvas, stubs, previewDocument) {
        function wrap(element) {
            return {
                get: function () { return element; },
                on: function (name, handler) {
                    if (!element || !element.addEventListener) return this;
                    element.addEventListener(name, function (event) {
                        handler.call(element, {
                            originalEvent: event,
                            target: event.target,
                            preventDefault: function () { event.preventDefault(); }
                        });
                    });
                    return this;
                },
                ready: function (handler) {
                    handler();
                    return this;
                },
                val: function (value) {
                    if (typeof value === "undefined") return element && element.value;
                    if (element) element.value = value;
                    return this;
                },
                attr: function (name, value) {
                    if (!element) return typeof value === "undefined" ? undefined : this;
                    if (typeof value === "undefined") {
                        return element.getAttribute ? element.getAttribute(name) : element[name];
                    }
                    if (element.setAttribute) element.setAttribute(name, value);
                    else element[name] = value;
                    return this;
                }
            };
        }

        return function dollar(target) {
            if (typeof target === "function") {
                target();
                return wrap(previewDocument);
            }

            if (target === document || target === previewDocument) return wrap(previewDocument);

            if (typeof target === "string") {
                if (target === "#canvas" || target === "canvas") return wrap(canvas);
                if (target.charAt(0) === "#") return wrap(stubs[target.slice(1)] || document.querySelector(target));
                return wrap(document.querySelector(target));
            }

            return wrap(target);
        };
    }

    function runJavaScript(source, canvas, parsed) {
        var scope = new paper.PaperScope();
        scope.setup(canvas);

        var stubs = parsed.stubs || {};
        var names = Object.keys(stubs);
        var mounted = mountDom(parsed);
        var previewDocument = makePreviewDocument(canvas, stubs, mounted);
        var dollar = makeDollar(canvas, stubs, previewDocument);
        var params = ["paper", "$", "canvas", "window", "document", "console"].concat(names);
        var args = [scope, dollar, canvas, window, previewDocument, console].concat(names.map(function (name) {
            return stubs[name];
        }));

        Function.apply(null, params.concat(source)).apply(scope, args);
        centerLayerIfNeeded(scope, canvas);
        if (scope.view) scope.view.update();
    }

    function runPaperScript(source, canvas, parsed) {
        var scope = new paper.PaperScope();
        scope.setup(canvas);
        mountDom(parsed || {});
        scope.execute(source);
        centerLayerIfNeeded(scope, canvas);
    }

    function centerLayerIfNeeded(scope, canvas) {
        if (!canvas.hasAttribute("data-paperjs-center-layer")) return;
        if (!scope.project || !scope.project.activeLayer || !scope.view) return;
        if (!scope.project.activeLayer.children.length) return;

        scope.project.activeLayer.position = scope.view.center;
    }

    function runSource(canvas, source) {
        if (!source || !window.paper) return;

        try {
            var parsed = parseSource(source);
            if (parsed.mode === "javascript") runJavaScript(parsed.code, canvas, parsed);
            else runPaperScript(parsed.code, canvas, parsed);
        } catch (error) {
            canvas.dataset.paperjsError = error.message;
            console.error("Paper.js preview failed", error);
        }
    }

    function runPreview(canvas) {
        var source = findCode(canvas);
        if (source) {
            runSource(canvas, source);
            return;
        }

        if (canvas.dataset.paperjsSource) {
            fetch(canvas.dataset.paperjsSource)
                .then(function (response) {
                    if (!response.ok) throw new Error("Unable to load " + canvas.dataset.paperjsSource);
                    return response.text();
                })
                .then(function (remoteSource) {
                    runSource(canvas, remoteSource);
                })
                .catch(function (error) {
                    canvas.dataset.paperjsError = error.message;
                    console.error("Paper.js preview source failed", error);
                });
        }
    }

    function boot() {
        Array.prototype.forEach.call(document.querySelectorAll("[data-paperjs-preview]"), runPreview);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
