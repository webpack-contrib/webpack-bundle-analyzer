(function (window, document) {
  var elem = document.createElement('div');

  elem.className = 'tooltip';

  var Tooltip = {
    elem: elem,
    initialized: false,
    shown: false,
    x: 0,
    y: 0,
    marginX: 10,
    marginY: 30,

    init: function () {
      if (Tooltip.initialized) return;

      Tooltip.initialized = true;
      document.body.appendChild(Tooltip.elem);
      document.addEventListener('mousemove', Tooltip._mouseMoveHandler, false);
    },

    show: function (html) {
      Tooltip.elem.innerHTML = html;

      if (Tooltip.shown) return;

      Tooltip.shown = true;
      Tooltip.elem.style.visibility = 'visible';
    },

    hide: function () {
      if (!Tooltip.shown) return;

      Tooltip.shown = false;
      Tooltip.elem.style.visibility = 'hidden';
    },

    _mouseMoveHandler: function (event) {
      Tooltip.x = event.pageX;
      Tooltip.y = event.pageY;
      Tooltip._updatePosition();
    },

    _updatePosition: function () {
      if (Tooltip.shown) {
        Tooltip.elem.style.left = Tooltip.x + Tooltip.marginX + 'px';
        Tooltip.elem.style.top = Tooltip.y + Tooltip.marginY + 'px';

        var boundingRect = Tooltip.elem.getBoundingClientRect();

        if (boundingRect.right > window.innerWidth) {
          // Shifting horizontally
          Tooltip.elem.style.left = (window.innerWidth - boundingRect.width) + 'px';
        }

        if (boundingRect.bottom > window.innerHeight) {
          // Flipping vertically
          Tooltip.elem.style.top = (Tooltip.y - Tooltip.marginY - boundingRect.height) + 'px';
        }
      }
    }
  };

  window.Tooltip = Tooltip;
})(this, document);
