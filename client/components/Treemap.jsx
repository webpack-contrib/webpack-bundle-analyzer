import {Component} from 'preact';
import FoamTree from '@carrotsearch/foamtree';

export default class Treemap extends Component {

  constructor(props) {
    super(props);
    this.treemap = null;
    this.zoomOutDisabled = false;
  }

  componentDidMount() {
    this.treemap = this.createTreemap();
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.treemap.set({
        dataObject: this.getTreemapDataObject(nextProps.data)
      });
    } else if (nextProps.highlightGroups !== this.props.highlightGroups) {
      const groupsToRedraw = [
        ...nextProps.highlightGroups,
        ...this.props.highlightGroups
      ];
      setTimeout(() => this.treemap.redraw(false, groupsToRedraw));
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.treemap.dispose();
  }

  render() {
    return (
      <div {...this.props} ref={this.saveNodeRef}/>
    );
  }

  saveNodeRef = node => (this.node = node);

  getTreemapDataObject(data = this.props.data) {
    return {groups: data};
  }

  createTreemap() {
    const component = this;
    const {props} = this;

    return new FoamTree({
      element: this.node,
      layout: 'squarified',
      stacking: 'flattened',
      pixelRatio: window.devicePixelRatio || 1,
      maxGroups: Infinity,
      maxGroupLevelsDrawn: Infinity,
      maxGroupLabelLevelsDrawn: Infinity,
      maxGroupLevelsAttached: Infinity,
      wireframeLabelDrawing: 'always',
      groupMinDiameter: 0,
      groupLabelVerticalPadding: 0.2,
      rolloutDuration: 0,
      pullbackDuration: 0,
      fadeDuration: 0,
      groupExposureZoomMargin: 0.2,
      zoomMouseWheelDuration: 300,
      openCloseDuration: 200,
      dataObject: this.getTreemapDataObject(),

      // color
      rainbowStartColor: 'hsl(240, 12%, 21%)',
      rainbowEndColor: 'hsl(240, 12%, 21%)',
      rainbowSaturationCorrection: 1,

      titleBarDecorator(opts, props, vars) {
        vars.titleBarShown = false;
      },
      groupColorDecorator(options, properties, variables) {
        const {highlightGroups} = component.props;
        const module = properties.group;

        if (highlightGroups && highlightGroups.has(module)) {
          variables.groupColor = {
            model: 'rgba',
            r: 255,
            g: 0,
            b: 0,
            a: 0.8
          };
        }
      },
      /**
       * Handle Foamtree's "group clicked" event
       * @param {FoamtreeEvent} event - Foamtree event object
       *  (see https://get.carrotsearch.com/foamtree/demo/api/index.html#event-details)
       * @returns {void}
       */
      onGroupClick(event) {
        preventDefault(event);
        if ((event.ctrlKey || event.secondary) && props.onGroupSecondaryClick) {
          props.onGroupSecondaryClick.call(component, event);
          return;
        }
        component.zoomOutDisabled = false;
        this.zoom(event.group);
      },
      onGroupDoubleClick: preventDefault,
      onGroupHover(event) {
        // Ignoring hovering on `FoamTree` branding group and the root group
        if (event.group && (event.group.attribution || event.group === this.get('dataObject'))) {
          event.preventDefault();
          if (props.onMouseLeave) {
            props.onMouseLeave.call(component, event);
          }
          return;
        }

        if (props.onGroupHover) {
          props.onGroupHover.call(component, event);
        }
      },
      onGroupMouseWheel(event) {
        const {scale} = this.get('viewport');
        const isZoomOut = (event.delta < 0);

        if (isZoomOut) {
          if (component.zoomOutDisabled) return preventDefault(event);
          if (scale < 1) {
            component.zoomOutDisabled = true;
            preventDefault(event);
          }
        } else {
          component.zoomOutDisabled = false;
        }
      }
    });
  }

  zoomToGroup(group) {
    this.zoomOutDisabled = false;

    while (group && !this.treemap.get('state', group).revealed) {
      group = this.treemap.get('hierarchy', group).parent;
    }

    if (group) {
      this.treemap.zoom(group);
    }
  }

  isGroupRendered(group) {
    const groupState = this.treemap.get('state', group);
    return !!groupState && groupState.revealed;
  }

  update() {
    this.treemap.update();
  }

  resize = () => {
    const {props} = this;
    this.treemap.resize();

    if (props.onResize) {
      props.onResize();
    }
  }
}

function preventDefault(event) {
  event.preventDefault();
}
