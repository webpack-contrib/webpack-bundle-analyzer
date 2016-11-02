window.addEventListener('load', function () {
  Tooltip.init();

  var zoomOutDisabled = true;

  var treemap = new CarrotSearchFoamTree({
    id: 'treemap',
    layout: 'squarified',
    stacking: 'flattened',
    maxGroupLevelsDrawn: Number.MAX_VALUE,
    maxGroupLabelLevelsDrawn: Number.MAX_VALUE,
    groupLabelVerticalPadding: 0.2,
    rolloutDuration: 0,
    pullbackDuration: 0,
    fadeDuration: 0,
    zoomMouseWheelDuration: 300,
    openCloseDuration: 200,
    dataObject: {
      groups: window.chartData
    },

    titleBarDecorator: function (opts, props, vars) {
      vars.titleBarShown = false;
    },

    onGroupClick: function (event) {
      preventDefault(event);
      zoomOutDisabled = false;
      treemap.zoom(event.group);
    },

    onGroupDoubleClick: preventDefault,

    onGroupHover: function (event) {
      var group = event.group;

      if (group) {
        Tooltip.show(
          '<b>' + group.label + '</b><br>' +
          (group.parsedSize === undefined ? '' : '<br>Parsed size: <b>' + filesize(group.parsedSize) + '</b>') +
          '<br>Stat size: <b>' + filesize(group.statSize) + '</b>' +
          (group.path ? '<br>Path: <b>' + group.path + '</b>' : '')
        );
      } else {
        Tooltip.hide();
      }
    },

    onGroupMouseWheel: function (event) {
      var isZoomOut = (event.delta < 0);

      if (isZoomOut) {
        if (zoomOutDisabled) return preventDefault(event);

        if (this.get('viewport').scale < 1) {
          zoomOutDisabled = true;
          preventDefault(event);
        }
      } else {
        zoomOutDisabled = false;
      }
    }
  });

  window.addEventListener('resize', treemap.resize);

  function preventDefault(event) {
    event.preventDefault();
  }
}, false);
