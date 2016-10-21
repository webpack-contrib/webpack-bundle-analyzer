/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Copyright 2002-2016, Carrot Search s.c, All Rights Reserved.
 *
 *
 * Debugging assertions for Carrot Search FoamTree.
 */
(function() {
  /**
   * Option constraints.
   */
  var optionDefinitions = function() {
    var args = {};

    // Static
    args["supported"] = {
      type: "boolean",
      asserts: ReadOnly(),
      static: true
    };
    args["geometry"] = {
      type: "object",
      asserts: ReadOnly(),
      static: true
    };

    [
      "geometry.boundingBox",
      "geometry.polygonCentroid",
      "geometry.rectangleInPolygon",
      "geometry.circleInPolygon",
      "geometry.stabPolygon",
      "context.roundRect",
      "context.fillPolygonWithText",
      "context.scratch",
      "context.replay"
    ].forEach(function (key) {
      args[key] = {
        type: "function",
        asserts: ReadOnly(),
        static: true
      }
    });

    // Special.
    args["dataObject"] = {
      type: "object",
      asserts: Or(IsObject(), IsNull(), IsUndefined())
    };

    args["imageData"] = {
      type: "string",
      asserts: ReadOnly()
    };

    args["viewport"] = {
      type: "object",
      asserts: ReadOnly()
    };

    ([
      "hierarchy",
      "geometry",
      "containerCoordinates",
      "state"
    ]).forEach(function(key) {
        args[key] = {
          type: "object",
          asserts: ReadOnly()
        };
      });

    args["times"] = {
      type: "object",
      asserts: ReadOnly()
    };

    ([
      "selection",
      "open",
      "exposure"
    ]).forEach(function(key) {
        args[key] = {
          type: "mixed"
        };
      });

    // Unconstrained strings
    ([
      "attributionText",
      "attributionLogo",
      "attributionUrl",
      "groupLabelFontFamily",
      "groupLabelFontStyle",
      "groupLabelFontWeight",
      "groupLabelFontVariant",
      "titleBarFontFamily",
      "titleBarFontStyle",
      "titleBarFontWeight",
      "titleBarFontVariant"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: Or(IsString(), IsNull(), IsUndefined())
        };
      });

    // Element identifier
    ([
      "id"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: And(IsString(), IdentifiesExistingElement())
        };
      });

    // DOM element
    ([
      "element"
    ]).forEach(function(key) {
        args[key] = {
          type: "object",
          asserts: IsElement()
        };
      });

    // Booleans
    ([
      "logging",
      "layoutByWeightOrder",
      "relaxationVisible",
      "showZeroWeightGroups",
      "parentOpacityBalancing",
      "descriptionGroupPolygonDrawn",
      "androidStockBrowserWorkaround"
    ]).forEach(function(key) {
        args[key] = {
          type: "boolean",
          asserts: IsBoolean()
        };
      });

    // enums
    args["layout"] = {
      type: "string",
      asserts: And(NotEmpty(), OneOf([
        "relaxed", "ordered", "squarified"
      ]))
    };

    args["stacking"] = {
      type: "string",
      asserts: And(NotEmpty(), OneOf([
        "hierarchical", "flattened"
      ]))
    };
    args["descriptionGroupType"] = {
      type: "string",
      asserts: And(NotEmpty(), OneOf([
        "floating", "stab"
      ]))
    };

    ([
      "initializer", // alias
      "relaxationInitializer"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: And(NotEmpty(), OneOf([
            "fisheye", "squarified", "blackhole", "ordered", "random",

            // Deprecated
            "order", "treemap"
          ]))
        };
      });

    args["groupContentDecoratorTriggering"] = {
      type: "string",
      asserts: And(NotEmpty(), OneOf([
        "onShapeDirty", "onSurfaceDirty"
      ]))
    };

    ([
      "groupGrowingEasing",
      "exposeEasing",
      "rolloutEasing",
      "pullbackEasing",
      "fadeEasing",
      "zoomMouseWheelEasing"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: And(NotEmpty(), OneOf([
            "linear", "bounce",
            "squareIn", "squareOut", "squareInOut",
            "cubicIn", "cubicOut", "cubicInOut",
            "quadIn", "quadOut", "quadInOut"
          ]))
        };
      });

    ([
      "groupFillType",
      "groupStrokeType"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: And(NotEmpty(), OneOf([
            "none", "plain", "gradient"
          ]))
        };
      });

    args["rainbowColorDistribution"] = {
      type: "string",
      asserts: And(NotEmpty(), OneOf([
        "radial", "linear"
      ]))
    };

    args["interactionHandler"] = {
      type: "string",
      asserts: And(NotEmpty(), OneOf([
        "hammerjs", "builtin"
      ]))
    };

    ([
      "wireframeLabelDrawing",
      "wireframeContentDecorationDrawing"
    ]).forEach(function (key) {
        args[key] = {
          type: "string",
          asserts: And(NotEmpty(), OneOf([
            "auto", "always", "never"
          ]))
        };
      });

    args["incrementalDraw"]  = {
      type: "string",
      asserts: And(NotEmpty(), OneOf([
        "none", "accurate", "fast"
      ]))
    };

    ([
      "rolloutStartPoint",
      "pullbackStartPoint"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: And(NotEmpty(), OneOf([
            "center", "topleft", "bottomright", "random"
          ]))
        };
      });

    ([
      "rolloutMethod",
      "pullbackMethod"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: And(NotEmpty(), OneOf([
            "groups", "individual"
          ]))
        };
      });


    // CSS colors
    ([
      "groupSelectionOutlineColor",
      "groupSelectionOutlineShadowColor",
      "groupExposureShadowColor",
      "rainbowStartColor",
      "rainbowEndColor",
      "titleBarBackgroundColor",
      "titleBarTextColor",
      "groupLabelDarkColor",
      "groupLabelLightColor"
    ]).forEach(function(key) {
        args[key] = {
          type: "string",
          asserts: And(NotEmpty(), CssColor())
        }
      });

    // Functions
    ([
      "groupColorDecorator",
      "groupLabelDecorator",
      "groupLabelLayoutDecorator",
      "groupContentDecorator",
      "titleBarDecorator"
    ]).forEach(function(key) {
        args[key] = {
          type: "function",
          asserts: IsFunction()
        }
      });

    // Callbacks
    ([
      "onModelChanging", "onModelChanged", "onRolloutStart", "onRolloutComplete",
      "onRelaxationStep", "onRedraw", "onViewReset",

      "onGroupOpenOrCloseChanging", "onGroupOpenOrCloseChanged",
      "onGroupExposureChanging", "onGroupExposureChanged",
      "onGroupSelectionChanging", "onGroupSelectionChanged",

      "onGroupHover", "onGroupClick", "onGroupDoubleClick", "onGroupHold",
      "onGroupMouseDown", "onGroupMouseUp","onGroupMouseMove", "onGroupMouseWheel",
      "onGroupDragStart", "onGroupDrag", "onGroupDragEnd",
      "onGroupTransformStart", "onGroupTransform", "onGroupTransformEnd",

      "onKeyUp"
    ]).forEach(function(key) {
        args[key] = {
          type: "function | Array",
          asserts: Or(IsFunction(), IsArrayOfFunctions())
        }
      });

    ([
      "groupLabelLineHeight",
      "groupExposureScale",
      "zoomMouseWheelFactor"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("[1,∞)"))
        }
      });

    ([
      "groupBorderRadius",
      "groupGrowingDrag",
      "groupUnexposureLabelColorThreshold",
      "rainbowLightnessShiftCenter",
      "parentFillOpacity",
      "parentStrokeOpacity",
      "parentLabelOpacity",
      "groupLabelMaxTotalHeight",
      "groupLabelUpdateThreshold",
      "groupLabelColorThreshold",
      "rolloutTransformationCenter",
      "rolloutPolygonDrag",
      "rolloutPolygonDuration",
      "rolloutLabelDelay",
      "rolloutLabelDrag",
      "rolloutLabelDuration",
      "rolloutChildGroupsDrag",
      "rolloutChildGroupsDelay",
      "pullbackTransformationCenter",
      "pullbackPolygonDelay",
      "pullbackPolygonDrag",
      "pullbackPolygonDuration",
      "pullbackLabelDelay",
      "pullbackLabelDrag",
      "pullbackLabelDuration",
      "pullbackChildGroupsDelay",
      "pullbackChildGroupsDrag",
      "pullbackChildGroupsDuration",
      "attributionLogoScale",
      "descriptionGroupDistanceFromCenter",
      "descriptionGroupSize",
      "descriptionGroupMaxHeight",
      "attributionDistanceFromCenter"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("[0,1]"))
        }
      });

    ([
      "rainbowLightnessCorrection",
      "rainbowSaturationCorrection"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("[-1,1]"))
        }
      });

    ([
      "rectangleAspectRatioPreference",
      "rolloutScalingStrength",
      "rolloutTranslationXStrength",
      "rolloutTranslationYStrength",
      "rolloutRotationStrength",
      "pullbackScalingStrength",
      "pullbackTranslationXStrength",
      "pullbackTranslationYStrength",
      "pullbackRotationStrength"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("(-∞,∞)"))
        }
      });

    ([
      "pixelRatio",
      "wireframePixelRatio",
      "relaxationMaxDuration",
      "relaxationQualityThreshold",
      "groupMinDiameter",
      "maxGroups",
      "maxGroupLevelsDrawn",
      "maxGroupLabelLevelsDrawn",
      "groupGrowingDuration",
      "groupResizingBudget",
      "groupBorderWidth",
      "groupBorderWidthScaling",
      "groupInsetWidth",
      "groupBorderRadiusCorrection",
      "groupSelectionOutlineWidth",
      "groupSelectionOutlineShadowSize",
      "groupFillGradientRadius",
      "groupStrokeWidth",
      "groupStrokeGradientRadius",
      "groupExposureShadowSize",
      "groupExposureZoomMargin",
      "exposeDuration",
      "openCloseDuration",
      "wireframeDrawMaxDuration",
      "wireframeToFinalFadeDuration",
      "wireframeToFinalFadeDelay",
      "finalCompleteDrawMaxDuration",
      "finalIncrementalDrawMaxDuration",
      "finalToWireframeFadeDuration",
      "groupLabelHorizontalPadding",
      "groupLabelVerticalPadding",
      "groupLabelMinFontSize",
      "groupLabelMaxFontSize",
      "rolloutDuration",
      "pullbackDuration",
      "fadeDuration",
      "zoomMouseWheelDuration",
      "maxLabelSizeForTitleBar",
      "titleBarMinFontSize",
      "titleBarMaxFontSize",
      "titleBarTextPaddingLeftRight",
      "titleBarTextPaddingTopBottom",
      "descriptionGroupMinHeight",
      "attributionWeight"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("[0,∞)"))
        }
      });

    ([
      "groupSelectionFillHueShift",
      "groupSelectionStrokeHueShift",
      "groupFillGradientCenterHueShift",
      "groupFillGradientRimHueShift",
      "groupStrokePlainHueShift",
      "groupStrokeGradientUpperHueShift",
      "groupStrokeGradientLowerHueShift",
      "groupHoverFillHueShift",
      "groupHoverStrokeHueShift",
      "rainbowColorDistributionAngle",
      "rainbowLightnessDistributionAngle"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("[-180,180]"))
        }
      });

    ([
      "groupSelectionFillSaturationShift",
      "groupSelectionFillLightnessShift",
      "groupSelectionStrokeSaturationShift",
      "groupSelectionStrokeLightnessShift",
      "groupFillGradientCenterSaturationShift",
      "groupFillGradientCenterLightnessShift",
      "groupFillGradientRimSaturationShift",
      "groupFillGradientRimLightnessShift",
      "groupStrokePlainSaturationShift",
      "groupStrokePlainLightnessShift",
      "groupStrokeGradientUpperSaturationShift",
      "groupStrokeGradientUpperLightnessShift",
      "groupStrokeGradientLowerSaturationShift",
      "groupStrokeGradientLowerLightnessShift",
      "groupHoverFillSaturationShift",
      "groupHoverFillLightnessShift",
      "groupHoverStrokeSaturationShift",
      "groupHoverStrokeLightnessShift",
      "rainbowLightnessShift",
      "groupUnexposureLightnessShift",
      "groupUnexposureSaturationShift"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("[-100,100]"))
        }
      });


    ([
      "groupStrokeGradientAngle"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), IsNumeric("[0,180]"))
        }
      });

    ([
      "descriptionGroupPosition",
      "attributionPosition"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), Or(IsNumeric("[0,360)"), OneOf([
            "topleft", "bottomright", "random"
          ])))
        }
      });

    ([
      "attributionTheme"
    ]).forEach(function(key) {
        args[key] = {
          type: "number",
          asserts: And(NotEmpty(), OneOf([
            "light", "dark"
          ]))
        }
      });

    // API changes
    ([
      "supported",
      "id",
      "element",
      "pixelRatio",
      "wireframePixelRatio",

      "dataObject",
      "relaxationInitializer",
      "relaxationMaxDuration",
      "relaxationVisible",
      "relaxationQualityThreshold",
      "groupMinDiameter",
      "showZeroWeightGroups",
    
      "groupGrowingDuration",
      "groupGrowingEasing",
      "groupGrowingDrag",
      "groupResizingBudget",
    
      "groupBorderRadius",
      "groupBorderWidth",
      "groupBorderWidthScaling",
      "groupInsetWidth",
      "groupBorderRadiusCorrection",

      "groupSelectionOutlineWidth",
      "groupSelectionOutlineColor",
      "groupSelectionOutlineShadowSize",
      "groupSelectionOutlineShadowColor",
      "groupSelectionFillHueShift",
      "groupSelectionFillSaturationShift",
      "groupSelectionFillLightnessShift",
      "groupSelectionStrokeHueShift",
      "groupSelectionStrokeSaturationShift",
      "groupSelectionStrokeLightnessShift",
    
      "groupFillType",
      "groupFillGradientRadius",
      "groupFillGradientCenterHueShift",
      "groupFillGradientCenterSaturationShift",
      "groupFillGradientCenterLightnessShift",
      "groupFillGradientRimHueShift",
      "groupFillGradientRimSaturationShift",
      "groupFillGradientRimLightnessShift",
    
      "groupStrokeType",
      "groupStrokeWidth",
      "groupStrokePlainHueShift",
      "groupStrokePlainSaturationShift",
      "groupStrokePlainLightnessShift",
      "groupStrokeGradientRadius",
      "groupStrokeGradientAngle",
      "groupStrokeGradientUpperHueShift",
      "groupStrokeGradientUpperSaturationShift",
      "groupStrokeGradientUpperLightnessShift",
      "groupStrokeGradientLowerHueShift",
      "groupStrokeGradientLowerSaturationShift",
      "groupStrokeGradientLowerLightnessShift",
    
      "groupHoverFillHueShift",
      "groupHoverFillSaturationShift",
      "groupHoverFillLightnessShift",
      "groupHoverStrokeHueShift",
      "groupHoverStrokeSaturationShift",
      "groupHoverStrokeLightnessShift",
    
      "groupExposureScale",
      "groupExposureShadowColor",
      "groupExposureShadowSize",
      "groupExposureZoomMargin",
      "groupUnexposureLightnessShift",
      "groupUnexposureSaturationShift",
      "groupUnexposureLabelColorThreshold",
      "exposeDuration",
      "exposeEasing",

      "groupLabelDecorator",
      "groupColorDecorator",
      "titleBarDecorator",

      "openCloseDuration",
    
      "rainbowStartColor",
      "rainbowEndColor",
      "rainbowColorDistribution",
      "rainbowColorDistributionAngle",
      "rainbowLightnessDistributionAngle",
      "rainbowSaturationCorrection",
      "rainbowLightnessCorrection",
      "rainbowLightnessShift",
      "rainbowLightnessShiftCenter",
    
      "parentFillOpacity",
      "parentStrokeOpacity",
      "parentLabelOpacity",
      "parentOpacityBalancing",
    
      "wireframeDrawMaxDuration",
      "wireframeLabelDrawing",
      "wireframeToFinalFadeDuration",
      "wireframeToFinalFadeDelay",
      "finalCompleteDrawMaxDuration",
      "finalIncrementalDrawMaxDuration",
      "finalToWireframeFadeDuration",
      "androidStockBrowserWorkaround",
    
      "groupLabelFontFamily",
      "groupLabelLineHeight",
      "groupLabelHorizontalPadding",
      "groupLabelVerticalPadding",
      "groupLabelMinFontSize",
      "groupLabelMaxFontSize",
      "groupLabelMaxTotalHeight",
      "groupLabelUpdateThreshold",
      "groupLabelDarkColor",
      "groupLabelLightColor",
      "groupLabelColorThreshold",
    
      "titleBarFontFamily",
      "titleBarMinFontSize",
      "titleBarMaxFontSize",
      "titleBarBackgroundColor",
      "titleBarTextColor",
      "titleBarTextPaddingLeftRight",
      "titleBarTextPaddingTopBottom",
      "maxLabelSizeForTitleBar",

      "rolloutStartPoint",
      "rolloutEasing",
      "rolloutMethod",
      "rolloutDuration",
      "rolloutScalingStrength",
      "rolloutTranslationXStrength",
      "rolloutTranslationYStrength",
      "rolloutRotationStrength",
      "rolloutTransformationCenter",
      "rolloutPolygonDrag",
      "rolloutPolygonDuration",
      "rolloutLabelDelay",
      "rolloutLabelDrag",
      "rolloutLabelDuration",
      "rolloutChildGroupsDrag",
      "rolloutChildGroupsDelay",
    
      "pullbackStartPoint",
      "pullbackEasing",
      "pullbackMethod",
      "pullbackDuration",
      "pullbackScalingStrength",
      "pullbackTranslationXStrength",
      "pullbackTranslationYStrength",
      "pullbackRotationStrength",
      "pullbackTransformationCenter",
      "pullbackPolygonDelay",
      "pullbackPolygonDrag",
      "pullbackPolygonDuration",
      "pullbackLabelDelay",
      "pullbackLabelDrag",
      "pullbackLabelDuration",
      "pullbackChildGroupsDelay",
      "pullbackChildGroupsDrag",
      "pullbackChildGroupsDuration",
    
      "fadeDuration",
      "fadeEasing",
    
      "zoomMouseWheelFactor",
      "zoomMouseWheelDuration",
      "zoomMouseWheelEasing",
    
      "attributionText",
      "attributionLogo",
      "attributionUrl",
    
      "interactionHandler",
    
      "onModelChanged",
      "onRelaxationStep",
    
      "onModelChanging",
      "onViewReset",
      "onGroupOpenOrCloseChanging",
      "onGroupOpenOrCloseChanged",
      "onGroupExposureChanging",
      "onGroupExposureChanged",
      "onGroupSelectionChanging",
      "onGroupSelectionChanged",
      "onRolloutStart",
      "onRolloutComplete",
      "onRedraw",

      "onGroupClick",
      "onGroupDoubleClick",
      "onGroupHold",
      "onGroupHover",
      "onGroupMouseWheel",
      "onGroupMouseDown",
      "onGroupDragStart",
      "onGroupDrag",
      "onGroupDragEnd",
      "onGroupTransformStart",
      "onGroupTransform",
      "onGroupTransformEnd",
      "onKeyUp",
    
      "selection",
      "open",
      "exposure",

      "hierarchy",
      "geometry",
      "state",

      "imageData",
      "logging",
      "times"
    ]).forEach(function(key) {
      args[key].since = "3.0.0";
    });

    ([
      "groupContentDecorator",
      "groupContentDecoratorTriggering",
      "wireframeContentDecorationDrawing",
      "geometry.boundingBox",
      "geometry.polygonCentroid",
      "geometry.rectangleInPolygon",
      "geometry.circleInPolygon",
      "geometry.stabPolygon",
      "context.roundRect",
      "context.fillPolygonWithText",
      "context.scratch",
      "context.replay"
    ]).forEach(function(key) {
      args[key].since = "3.1.0";
    });

    ([
      "maxGroups",
      "maxGroupLevelsDrawn",
      "maxGroupLabelLevelsDrawn"
    ]).forEach(function(key) {
      args[key].since = "3.2.0";
    });

    ([
      "attributionPosition",
      "attributionDistanceFromCenter"
    ]).forEach(function(key) {
      args[key].since = "3.2.1";
    });

    ([
      "groupLabelFontStyle",
      "groupLabelFontWeight",
      "groupLabelFontVariant",
      "titleBarFontStyle",
      "titleBarFontWeight",
      "titleBarFontVariant"
    ]).forEach(function(key) {
      args[key].since = "3.2.2";
    });

    ([
      "viewport"
    ]).forEach(function(key) {
      args[key].since = "3.2.3";
    });

    ([
      "relaxationInitializer",
      "layout",
      "layoutByWeightOrder",
      "rectangleAspectRatioPreference"
    ]).forEach(function(key) {
      args[key].since = "3.3.0";
    });

    ([
      "attributionWeight"
    ]).forEach(function(key) {
      args[key].since = "3.3.1";
    });

    ([
      "stacking",
      "descriptionGroupType",
      "descriptionGroupSize",
      "descriptionGroupMinHeight",
      "descriptionGroupMaxHeight",
      "descriptionGroupPosition",
      "descriptionGroupDistanceFromCenter",
      "attributionLogoScale",
      "attributionTheme",
      "groupLabelLayoutDecorator",
      "descriptionGroupPolygonDrawn",
      "incrementalDraw"
    ]).forEach(function(key) {
      args[key].since = "3.4.0";
    });

    ([
      "onGroupMouseMove",
      "onGroupMouseUp",
      "containerCoordinates"
    ]).forEach(function(key) {
      args[key].since = "3.4.4";
    });

    ([
      "initializer"
    ]).forEach(function(key) {
      args[key].until = "3.5.0";
    });

    return args;
  };


  /**
   * Constraint definitions.
   */

  function valueOf(v) {
    if (typeof v == "function") {
      return "[function]";
    } else {
      return "'" + v + "'";
    }
  }


  var NotEmpty = (function() {
    function NotEmpty() {
      if (this === window) return new NotEmpty();
    }

    NotEmpty.prototype.validate = function(value) {
      if ((typeof value == "undefined") || value == null || ("" + value) === "") {
        throw valueOf(value) + " is empty";
      }
    };

    NotEmpty.prototype.toString = function() {
      return "value is not empty";
    };

    return NotEmpty;
  })();


  var IsNull = (function() {
    function IsNull() {
      if (this === window) return new IsNull();
    }

    IsNull.prototype.validate = function(value) {
      if (value !== null) {
        throw valueOf(value) + " is not null";
      }
    };

    IsNull.prototype.toString = function() {
      return "value is null"
    };

    return IsNull;
  })();


  var IsUndefined = (function() {
    function IsUndefined() {
      if (this === window) return new IsUndefined();
    }

    IsUndefined.prototype.validate = function(value) {
      if (typeof value !== "undefined") {
        throw valueOf(value) + " is not undefined";
      }
    };

    IsUndefined.prototype.toString = function() {
      return "value is undefined";
    };

    return IsUndefined;
  })();


  var IsObject = (function() {
    function IsObject() {
      if (this === window) return new IsObject();
    }

    IsObject.prototype.validate = function(value) {
      if (value !== Object(value)) {
        throw valueOf(value) + " is not an object";
      }
    };

    IsObject.prototype.toString = function() {
      return "value is an object";
    };

    return IsObject;
  })();


  var ReadOnly = (function() {
    function ReadOnly() {
      if (this === window) return new ReadOnly();
    }

    ReadOnly.prototype.validate = function(value) {
      throw "option is read-only";
    };

    ReadOnly.prototype.toString = function() {
      return "option is read-only";
    };

    return ReadOnly;
  })();


  var IsNumeric = (function() {
    function IsNumeric(range) {
      if (this === window) return new IsNumeric(range);

      function inclusiveBracket(v) {
        switch (v) {
          case '[':
          case ']':
            return true;
          case '(':
          case ')':
            return false;
          default:
            throw "Unrecognized bracket op: " + v;
        }
      }

      function parseRange(v) {
        if (v == "∞")  { return Number.POSITIVE_INFINITY; }
        if (v == "-∞") { return Number.NEGATIVE_INFINITY; }
        if (isNaN(parseFloat(v))) throw "Not a number in range: " + v;
        return parseFloat(v);
      }

      // Simplistic range parsing.
      if (range) {
        // "(x,y)" => ["(", "0", ",", "∞", ")"]
        var comps = range.replace(/[\[\]\(\),]/g, " $& ").trim().split(/\s+/);
        this.left = parseRange(comps[1]);
        this.leftInclusive = inclusiveBracket(comps[0]);
        this.right = parseRange(comps[3]);
        this.rightInclusive = inclusiveBracket(comps[4]);
        this.range = range.replace(/∞/g, "infinity");
      }
    }

    IsNumeric.prototype.validate = function(value) {
      if (isNaN(parseFloat(value))) {
        throw valueOf(value) + " is not a number";
      }

      if (!isFinite(value)) {
        throw valueOf(value) + " is not a finite number";
      }

      if (this.range) {
        if ((value < this.left  || (value == this.left  && !this.leftInclusive)) ||
            (value > this.right || (value == this.right && !this.rightInclusive))) {
          throw valueOf(value) + " is not within " + this.range;
        }
      }
    };

    IsNumeric.prototype.toString = function() {
      if (this.range) {
        return "value is a number in range " + this.range;
      } else {
        return "value is a number";
      }
    };

    return IsNumeric;
  })();


  var IsString = (function() {
    function IsString() {
      if (this === window) return new IsString();
    }

    IsString.prototype.validate = function(value) {
      var toString = Object.prototype.toString;
      if (value != null && toString.call(value) != "[object String]") {
        throw valueOf(value) + " is not a string";
      }
    };

    IsString.prototype.toString = function() {
      return "value is a string";
    };

    return IsString;
  })();


  var IsBoolean = (function() {
    function IsBoolean() {
      if (this === window) return new IsBoolean();
    }

    IsBoolean.prototype.validate = function(value) {
      if (value != null && typeof value !== "undefined") {
        if (value !== true && value !== false) {
          throw valueOf(value) + " is not a boolean";
        }
      }
    };

    IsBoolean.prototype.toString = function() {
      return "value is a boolean";
    };

    return IsBoolean;
  })();

  var IsFunction = (function() {
    function IsFunction() {
      if (this === window) return new IsFunction();
    }

    IsFunction.prototype.validate = function(value) {
      if (value != null && value != undefined) {
        if (typeof value !== "function") {
          throw valueOf(value) + " [" + (typeof value) + "] is not a function";
        }
      }
    };

    IsFunction.prototype.toString = function() {
      return "value is a function";
    };

    return IsFunction;
  })();

  var IsArrayOfFunctions = (function() {
    function IsArrayOfFunctions() {
      if (this === window) return new IsArrayOfFunctions();
    }

    IsArrayOfFunctions.prototype.validate = function(value) {
      if (value != null && value != undefined) {
        var arrayOfFunctions = Array.isArray(value);
        if (arrayOfFunctions) {
          value.forEach(function(key) {
            if (typeof key !== "function") {
              arrayOfFunctions = false;
            }
          });
        }
        if (!arrayOfFunctions) {
          throw valueOf(value) + " [" + (typeof value) + "] is not an array of functions";
        }
      }
    };

    IsArrayOfFunctions.prototype.toString = function() {
      return "value is an array of functions";
    };

    return IsArrayOfFunctions;
  })();

  var Matches = (function() {
    function Matches(regexp) {
      if (this === window) { return new Matches(regexp); }
      this.regexp = regexp;
    }

    Matches.prototype.validate = function(value) {
      if (!this.regexp.test(value)) throw valueOf(value) + " does not match " + this.regexp;
    };

    Matches.prototype.toString = function() {
      return "value matches " + this.regexp;
    };

    return Matches;
  })();


  var CssColor = (function() {
    function CssColor() {
      if (this === window) { return new CssColor(); }
    }

    var predefinedColorsRegexp = new RegExp("^(AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenrod|DarkGray|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGray|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|Goldenrod|Gray|Green|GreenYellow|Honeydew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenrodYellow|LightGreen|LightGrey|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquamarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenrod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|Seashell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)$", "i");

    CssColor.prototype.validate = function(value) {
      if (/^rgba\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*\)$/.test(value)) {
        return;
      }
      if (/^rgb\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*\)$/.test(value)) {
        return;
      }
      if (/^hsla\(\s*([^,\s]+)\s*,\s*([^,%\s]+)%\s*,\s*([^,\s%]+)%\s*,\s*([^,\s]+)\s*\)$/.test(value)) {
        return;
      }
      if (/^hsl\(\s*([^,\s]+)\s*,\s*([^,\s%]+)%\s*,\s*([^,\s%]+)%\s*\)$/.test(value)) {
        return;
      }
      if (/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.test(value)) {
        return;
      }
      if (/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.test(value)) {
        return;
      }
      if (predefinedColorsRegexp.test(value)) {
        return;
      }

      throw valueOf(value) + " is not a CSS color specification";
    };

    CssColor.prototype.toString = function() {
      return "value is a CSS color";
    };

    return CssColor;
  })();


  var IdentifiesExistingElement = (function() {
    function IdentifiesExistingElement() {
      if (this === window) return new IdentifiesExistingElement();
    }

    IdentifiesExistingElement.prototype.validate = function(value) {
      var element = document.getElementById(value);
      if (!element) {
        throw valueOf(value) + " is not an identifier of an existing DOM element";
      }
    };

    IdentifiesExistingElement.prototype.toString = function() {
      return "value is an identifier of an existing DOM element";
    };

    return IdentifiesExistingElement;
  })();


  var IsElement = (function() {
    function IsElement() {
      if (this === window) return new IsElement();
    }

    IsElement.prototype.validate = function(value) {
      if (!(value instanceof HTMLElement)) {
        throw valueOf(value) + " is not a DOM element";
      }
    };

    IsElement.prototype.toString = function() {
      return "value is a DOM element";
    };

    return IsElement;
  })();


  var OneOf = (function() {
    function OneOf(values) {
      if (this === window) { return new OneOf(values); }
      this.values = values;
    }

    OneOf.prototype.validate = function(value) {
      if (this.values.indexOf(value) < 0) {
        throw valueOf(value) + " not one of [" + this.values.join(", ") + "]";
      }
    };

    OneOf.prototype.toString = function() {
      return "value one of [" + this.values.join(", ") + "]";
    };

    return OneOf;
  })();


  var Or = (function() {
    function Or() {
      if (this === window) { return Or.apply(new Or(), arguments); }
      this.clauses = Array.prototype.slice.call(arguments);
      return this;
    }

    Or.prototype.validate = function(value) {
      var vetoes = [];
      for (var i = 0; i < this.clauses.length; i++) {
        try {
          this.clauses[i].validate(value);
        } catch (e) {
          vetoes.push(e);
        }
      }

      if (vetoes.length == this.clauses.length) {
        throw vetoes.map(function(e) {return "(" + e + ")";}).join(" and ");
      }
    };

    Or.prototype.toString = function() {
      return this.clauses.map(function(e) {return "(" + e + ")";}).join(" or ");
    };

    return Or;
  })();


  var And = (function() {
    function And() {
      if (this === window) { return And.apply(new And(), arguments); }
      this.clauses = Array.prototype.slice.call(arguments);
      return this;
    }

    And.prototype.validate = function(value) {
      var vetoes = [];
      for (var i = 0; i < this.clauses.length; i++) {
        try {
          this.clauses[i].validate(value);
        } catch (e) {
          vetoes.push(e);
          break;  // fastpath, no need to evaluate further.
        }
      }

      if (vetoes.length != 0) {
        throw vetoes.map(function(e) {return "(" + e + ")";}).join(" and ");
      }
    };

    And.prototype.toString = function() {
      return this.clauses.map(function(e) {return "(" + e + ")";}).join(" and ");
    };

    return And;
  })();

  // Install or defer until FoamTree is loaded.
  var args = optionDefinitions();

  // Validate that there is an assert for each default option
  // and also that there are no asserts referring to non-existing options.
  var foamtreeClass = window["CarrotSearchFoamTree"];
  if (foamtreeClass) {
    var defaults = CarrotSearchFoamTree.defaults;
    for (var option in defaults) {
      if (defaults.hasOwnProperty(option)) {
        if (!args.hasOwnProperty(option)) {
          window.console.error("No assertion defined for option: " + option);
        }
      }
    }
    for (var assert in args) {
      if (args.hasOwnProperty(assert) && !args[assert].static && !args[assert].until) {
        if (!defaults.hasOwnProperty(assert)) {
          window.console.error("No option for assert: " + assert);
        }
      }
    }
  }

  function exists(option) {
    var exists = args.hasOwnProperty(option);
    if (!exists) {
      warn("option " + option + " does not exist.");
    }
    return exists;
  }

  var validator = {
    spec: function (option) {
      if (exists(option)) {
        return args[option];
      }
    },

    exists: exists,

    /**
     * Validates the provided options against the defined asserts,
     * removes invalid options from the object.
     *
     * @param opts
     */
    validate: function (opts, verbose) {
      for (var option in opts) {
        if (opts.hasOwnProperty(option)) {
          var assert = args[option];
          var valid = true;

          if (assert) {
            try {
              assert.asserts && assert.asserts.validate(opts[option]);
              if (verbose) {
                info("option " + option + " set to '" + opts[option] + "'.");
              }
            } catch (e) {
              warn("skipping incorrect value for option " + option + " " + e);
              valid = false;
            }
          } else {
            warn("skipping unknown option " + option);
            valid = false;
          }

          if (!valid) {
            delete opts[option];
          }
        }
      }
    }
  };

  if (foamtreeClass) {
    foamtreeClass["asserts"] = validator;
  } else {
    window["CarrotSearchFoamTree.asserts"] = validator;
  }


  function warn(message) {
    window.console.warn("FoamTree: " + message)
  }

  function info(message) {
    window.console.info("FoamTree: " + message)
  }
})();

/*
 * Build information
 * -----------------
 *
 * Build type    : Carrot Search FoamTree HTML5 (demo variant)
 * Build version : 3.4.4
 * Build number  : FOAMTREE-SOFTWARE4-DIST-26
 * Build time    : Sep 23, 2016
 * Built by      : bamboo
 * Build revision: 36955f78f6b79223438db3b18b9b64b5aad799bb/36955f78
 */