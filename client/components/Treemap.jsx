/** @jsx h */
import { h, Component } from 'preact';
import FoamTree from 'carrotsearch.foamtree';

export default class Treemap extends Component {
  constructor(props) {
    super(props);
    this.treemap = null;
    this.zoomOutDisabled = false;
  }

  componentDidMount() {
    this.treemap = this.createTreemap();
    window.addEventListener('resize', this.treemap.resize, false);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.treemap.resize);
    this.treemap.dispose();
  }

  render() {
    const { className } = this.props;

    return (
      <div ref={this.saveNode} className={className}/>
    );
  }

  saveNode = node => (this.node = node);

  createTreemap() {
    const component = this;
    const { props } = this;
    let zoomOutDisabled = false;

    return new FoamTree({
      element: this.node,
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
        groups: this.props.data
      },
      titleBarDecorator(opts, props, vars) {
        vars.titleBarShown = false;
      },
      onGroupClick(event) {
        preventDefault(event);
        zoomOutDisabled = false;
        this.zoom(event.group);
      },
      onGroupDoubleClick: preventDefault,
      onGroupHover(event) {
        // Ignoring hovering on `FoamTree` branding group
        if (event.group && event.group.attribution) {
          event.preventDefault();
          return;
        }

        if (props.onGroupHover) {
          props.onGroupHover.call(component, event);
        }
      },
      onGroupMouseWheel(event) {
        const isZoomOut = (event.delta < 0);

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
  }
}

function preventDefault(event) {
  event.preventDefault();
}
