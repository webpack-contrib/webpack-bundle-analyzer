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
    this.updateData(this.props.weightProp);
    this.treemap = this.createTreemap();
    window.addEventListener('resize', this.treemap.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.data !== this.props.data ||
      nextProps.weightProp !== this.props.weightProp
    ) {
      this.updateData(nextProps.weightProp, nextProps.data);
      this.treemap.set({ dataObject: this.treemapDataObject });
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.treemap.resize);
    this.treemap.dispose();
  }

  render() {
    return (
      <div {...this.props} ref={this.saveNode}/>
    );
  }

  saveNode = node => (this.node = node);

  get treemapDataObject() {
    return { groups: this.data };
  }

  createTreemap() {
    const component = this;
    const { props } = this;
    let zoomOutDisabled = false;

    return new FoamTree({
      element: this.node,
      layout: 'squarified',
      stacking: 'flattened',
      pixelRatio: window.devicePixelRatio || 1,
      maxGroupLevelsDrawn: Number.MAX_VALUE,
      maxGroupLabelLevelsDrawn: Number.MAX_VALUE,
      groupLabelVerticalPadding: 0.2,
      rolloutDuration: 0,
      pullbackDuration: 0,
      fadeDuration: 0,
      zoomMouseWheelDuration: 300,
      openCloseDuration: 200,
      dataObject: this.treemapDataObject,
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

  update() {
    this.treemap.update();
  }

  updateData(sizeProp, data) {
    data = data || this.props.data;
    this.data = getDataForSize(data, sizeProp);
  }

}

function getDataForSize(data, sizeProp) {
  return data.reduce((filteredData, group) => {
    if (group[sizeProp]) {
      if (group.groups) {
        group = {
          ...group,
          groups: getDataForSize(group.groups, sizeProp)
        };
      }

      group.weight = group[sizeProp];
      filteredData.push(group);
    }

    return filteredData;
  }, []);
}

function preventDefault(event) {
  event.preventDefault();
}
