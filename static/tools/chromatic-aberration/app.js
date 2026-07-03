(function () {
      var canvas = document.getElementById('renderCanvas');
      var fallbackMessage = document.getElementById('fallbackMessage');
      var fileInput = document.getElementById('fileInput');
      var chooseButton = document.getElementById('chooseButton');
      var saveButton = document.getElementById('saveButton');
      var resetButton = document.getElementById('resetButton');
      var dropZone = document.getElementById('dropZone');
      var emptyState = document.getElementById('emptyState');
      var imageMeta = document.getElementById('imageMeta');
      var statusText = document.getElementById('statusText');
      var modeButtons = document.getElementById('modeButtons');
      var paletteButtons = document.getElementById('paletteButtons');
      var presetGrid = document.getElementById('presetGrid');
      var controls = Array.prototype.slice.call(document.querySelectorAll('[data-control]'));
      var gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, premultipliedAlpha: false }) ||
        canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true, premultipliedAlpha: false });

      var state = {
        strength: 18,
        falloff: 1.4,
        start: 0.18,
        distortion: 0.08,
        blur: 0,
        edge: 0.18,
        angle: 0,
        centerX: 50,
        centerY: 50,
        mode: 0,
        palette: 0
      };
      var presets = {
        clean: { strength: 18, falloff: 1.4, start: 0.18, distortion: 0.08, blur: 0, edge: 0.18, angle: 0, centerX: 50, centerY: 50, mode: 0, palette: 0 },
        wide: { strength: 46, falloff: 2.25, start: 0.05, distortion: -0.34, blur: 0.4, edge: 0.28, angle: 0, centerX: 50, centerY: 50, mode: 0, palette: 1 },
        purple: { strength: 31, falloff: 0.9, start: 0.0, distortion: 0.02, blur: 5.2, edge: 0.72, angle: 0, centerX: 50, centerY: 50, mode: 1, palette: 2 },
        prism: { strength: 38, falloff: 1, start: 0, distortion: 0, blur: 0.6, edge: 0.34, angle: 24, centerX: 50, centerY: 50, mode: 2, palette: 4 },
        tangent: { strength: 42, falloff: 1.65, start: 0.1, distortion: 0.18, blur: 0.8, edge: 0.38, angle: 0, centerX: 50, centerY: 50, mode: 3, palette: 0 },
        spectral: { strength: 70, falloff: 1.1, start: 0, distortion: -0.12, blur: 2.2, edge: 0.62, angle: 314, centerX: 46, centerY: 47, mode: 2, palette: 4 }
      };
      var program = null;
      var texture = null;
      var uniforms = {};
      var renderPending = false;
      var imageName = 'image';
      var sourceWidth = 0;
      var sourceHeight = 0;
      var outputScale = 1;
      var maxTextureSize = 4096;

      if (!gl) {
        canvas.style.display = 'none';
        emptyState.style.display = 'none';
        fallbackMessage.style.display = 'block';
        saveButton.disabled = true;
        statusText.textContent = 'WebGL unavailable';
        return;
      }

      initWebGL();
      bindEvents();
      applyPreset('clean');
      setEmptyState();

      function initWebGL() {
        maxTextureSize = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE));
        program = createProgram(
          document.getElementById('vertexShader').textContent,
          document.getElementById('fragmentShader').textContent
        );

        gl.useProgram(program);

        var positionLocation = gl.getAttribLocation(program, 'a_position');
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1
        ]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        [
          'u_image',
          'u_resolution',
          'u_center',
          'u_strength',
          'u_falloff',
          'u_start',
          'u_distortion',
          'u_blur',
          'u_edge',
          'u_angle',
          'u_mode',
          'u_palette'
        ].forEach(function (name) {
          uniforms[name] = gl.getUniformLocation(program, name);
        });

        texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      }

      function bindEvents() {
        chooseButton.addEventListener('click', function () {
          fileInput.click();
        });

        fileInput.addEventListener('change', function (event) {
          var file = event.target.files && event.target.files[0];
          if (file) {
            loadFile(file);
          }
        });

        saveButton.addEventListener('click', savePng);
        resetButton.addEventListener('click', function () {
          applyPreset('clean');
        });

        ['dragenter', 'dragover'].forEach(function (eventName) {
          dropZone.addEventListener(eventName, function (event) {
            event.preventDefault();
            dropZone.classList.add('is-dragging');
          });
        });

        ['dragleave', 'drop'].forEach(function (eventName) {
          dropZone.addEventListener(eventName, function (event) {
            event.preventDefault();
            dropZone.classList.remove('is-dragging');
          });
        });

        dropZone.addEventListener('drop', function (event) {
          var file = event.dataTransfer.files && event.dataTransfer.files[0];
          if (file && file.type.indexOf('image/') === 0) {
            loadFile(file);
          }
        });

        dropZone.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInput.click();
          }
        });

        controls.forEach(function (input) {
          input.addEventListener('input', function () {
            state[input.dataset.control] = Number(input.value);
            setActivePreset('');
            updateValueLabels();
            queueRender();
          });
        });

        modeButtons.addEventListener('click', function (event) {
          var button = event.target.closest('button[data-mode]');
          if (!button) {
            return;
          }
          state.mode = Number(button.dataset.mode);
          setPressed(modeButtons, button);
          setActivePreset('');
          queueRender();
        });

        paletteButtons.addEventListener('click', function (event) {
          var button = event.target.closest('button[data-palette]');
          if (!button) {
            return;
          }
          state.palette = Number(button.dataset.palette);
          setPressed(paletteButtons, button);
          setActivePreset('');
          queueRender();
        });

        presetGrid.addEventListener('click', function (event) {
          var button = event.target.closest('button[data-preset]');
          if (!button) {
            return;
          }
          applyPreset(button.dataset.preset);
        });
      }

      function createProgram(vertexSource, fragmentSource) {
        var vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
        var fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(shaderProgram));
        }

        return shaderProgram;
      }

      function compileShader(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(shader));
        }

        return shader;
      }

      function setEmptyState() {
        sourceWidth = 0;
        sourceHeight = 0;
        outputScale = 1;
        saveButton.disabled = true;
        dropZone.classList.remove('has-image');
        imageMeta.innerHTML = '<span><strong>No image loaded</strong></span>';
        setStatus('Drop image');
      }

      function loadFile(file) {
        if (file.type.indexOf('image/') !== 0) {
          setStatus('Use an image file');
          return;
        }

        var objectUrl = URL.createObjectURL(file);
        var image = new Image();
        setStatus('Loading');

        image.onload = function () {
          setTextureFromSource(image, file.name.replace(/\.[^.]+$/, '') || 'image', image.naturalWidth || image.width, image.naturalHeight || image.height);
          URL.revokeObjectURL(objectUrl);
        };

        image.onerror = function () {
          setStatus('Could not read image');
          URL.revokeObjectURL(objectUrl);
        };

        image.src = objectUrl;
      }

      function setTextureFromSource(source, name, width, height) {
        var workCanvas = document.createElement('canvas');
        var workCtx = workCanvas.getContext('2d');
        outputScale = Math.min(1, maxTextureSize / Math.max(width, height));
        sourceWidth = Math.max(1, Math.round(width * outputScale));
        sourceHeight = Math.max(1, Math.round(height * outputScale));
        workCanvas.width = sourceWidth;
        workCanvas.height = sourceHeight;
        workCtx.drawImage(source, 0, 0, sourceWidth, sourceHeight);

        imageName = sanitizeName(name);
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
        gl.viewport(0, 0, sourceWidth, sourceHeight);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, workCanvas);
        saveButton.disabled = false;
        dropZone.classList.add('has-image');
        updateMeta();
        setStatus('Ready');
        queueRender();
      }

      function updateMeta() {
        var scaleLabel = outputScale < 1 ? '<span><strong>' + Math.round(outputScale * 100) + '%</strong> export scale</span>' : '';
        imageMeta.innerHTML = [
          '<span><strong>' + escapeHtml(imageName) + '</strong></span>',
          '<span>' + sourceWidth + ' x ' + sourceHeight + ' px</span>',
          scaleLabel
        ].filter(Boolean).join('');
      }

      function queueRender() {
        if (renderPending) {
          return;
        }

        renderPending = true;
        window.requestAnimationFrame(render);
      }

      function render() {
        renderPending = false;
        if (!sourceWidth || !sourceHeight) {
          return;
        }

        gl.useProgram(program);
        gl.viewport(0, 0, sourceWidth, sourceHeight);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uniforms.u_image, 0);
        gl.uniform2f(uniforms.u_resolution, sourceWidth, sourceHeight);
        gl.uniform2f(uniforms.u_center, state.centerX / 100, 1 - state.centerY / 100);
        gl.uniform1f(uniforms.u_strength, state.strength);
        gl.uniform1f(uniforms.u_falloff, state.falloff);
        gl.uniform1f(uniforms.u_start, state.start);
        gl.uniform1f(uniforms.u_distortion, state.distortion);
        gl.uniform1f(uniforms.u_blur, state.blur);
        gl.uniform1f(uniforms.u_edge, state.edge);
        gl.uniform1f(uniforms.u_angle, state.angle * Math.PI / 180);
        gl.uniform1f(uniforms.u_mode, state.mode);
        gl.uniform1f(uniforms.u_palette, state.palette);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      function savePng() {
        if (!sourceWidth || !sourceHeight) {
          setStatus('Load image first');
          return;
        }

        render();
        canvas.toBlob(function (blob) {
          if (!blob) {
            setStatus('Export failed');
            return;
          }

          var link = document.createElement('a');
          var url = URL.createObjectURL(blob);
          link.href = url;
          link.download = imageName + '-chromatic-aberration.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.setTimeout(function () {
            URL.revokeObjectURL(url);
          }, 1000);
          setStatus('PNG saved');
          window.setTimeout(function () {
            setStatus('Ready');
          }, 1400);
        }, 'image/png');
      }

      function applyPreset(name) {
        var next = presets[name];
        if (!next) {
          return;
        }

        Object.keys(next).forEach(function (key) {
          state[key] = next[key];
        });

        controls.forEach(function (input) {
          input.value = state[input.dataset.control];
        });
        setPressedByValue(modeButtons, 'mode', state.mode);
        setPressedByValue(paletteButtons, 'palette', state.palette);
        setActivePreset(name);
        updateValueLabels();
        queueRender();
      }

      function updateValueLabels() {
        Object.keys(state).forEach(function (key) {
          var node = document.querySelector('[data-value-for="' + key + '"]');
          if (!node) {
            return;
          }

          if (key === 'angle') {
            node.textContent = Math.round(state[key]) + ' deg';
          } else if (key === 'centerX' || key === 'centerY') {
            node.textContent = Math.round(state[key]) + '%';
          } else if (key === 'strength') {
            node.textContent = Math.round(state[key]).toString();
          } else {
            node.textContent = Number(state[key]).toFixed(key === 'blur' ? 1 : 2);
          }
        });
      }

      function setPressed(group, activeButton) {
        Array.prototype.forEach.call(group.querySelectorAll('button'), function (button) {
          button.setAttribute('aria-pressed', button === activeButton ? 'true' : 'false');
        });
      }

      function setPressedByValue(group, key, value) {
        Array.prototype.forEach.call(group.querySelectorAll('button'), function (button) {
          var buttonValue = Number(button.dataset[key]);
          button.setAttribute('aria-pressed', buttonValue === Number(value) ? 'true' : 'false');
        });
      }

      function setActivePreset(name) {
        Array.prototype.forEach.call(presetGrid.querySelectorAll('button'), function (button) {
          button.classList.toggle('is-active', button.dataset.preset === name);
        });
      }

      function setStatus(text) {
        statusText.textContent = text;
      }

      function sanitizeName(name) {
        return String(name || 'image')
          .replace(/\.[^.]+$/, '')
          .replace(/[^a-z0-9-_]+/gi, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 72) || 'image';
      }

      function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
          return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          }[char];
        });
      }
    }());
