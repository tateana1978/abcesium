/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.116
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  CylinderGeometryLibrary_default
} from "./chunk-LAQP3SCC.js";
import {
  GeometryOffsetAttribute_default
} from "./chunk-GXUXEOE2.js";
import {
  IndexDatatype_default
} from "./chunk-P4XKB3QZ.js";
import {
  GeometryAttributes_default
} from "./chunk-EOXYZ34O.js";
import {
  GeometryAttribute_default,
  Geometry_default,
  PrimitiveType_default
} from "./chunk-2ZBL3MVO.js";
import {
  BoundingSphere_default
} from "./chunk-7COR472O.js";
import "./chunk-2KACWKS4.js";
import "./chunk-X6XOMPWL.js";
import "./chunk-2XPLH3JY.js";
import {
  ComponentDatatype_default
} from "./chunk-NZWNZA6S.js";
import {
  Cartesian2_default,
  Cartesian3_default
} from "./chunk-ADOVHYWO.js";
import "./chunk-QCQUZGXI.js";
import "./chunk-I37B3MZ2.js";
import "./chunk-N4KXMWQU.js";
import {
  defaultValue_default
} from "./chunk-TZORKRNK.js";
import {
  Check_default,
  DeveloperError_default
} from "./chunk-SS4ESNE3.js";
import {
  defined_default
} from "./chunk-YDVSBWEO.js";

// packages/engine/Source/Core/CylinderOutlineGeometry.js
var radiusScratch = new Cartesian2_default();
function CylinderOutlineGeometry(options) {
  options = defaultValue_default(options, defaultValue_default.EMPTY_OBJECT);
  const length = options.length;
  const topRadius = options.topRadius;
  const bottomRadius = options.bottomRadius;
  const slices = defaultValue_default(options.slices, 128);
  const numberOfVerticalLines = Math.max(
    defaultValue_default(options.numberOfVerticalLines, 16),
    0
  );
  Check_default.typeOf.number("options.positions", length);
  Check_default.typeOf.number("options.topRadius", topRadius);
  Check_default.typeOf.number("options.bottomRadius", bottomRadius);
  Check_default.typeOf.number.greaterThanOrEquals("options.slices", slices, 3);
  if (defined_default(options.offsetAttribute) && options.offsetAttribute === GeometryOffsetAttribute_default.TOP) {
    throw new DeveloperError_default(
      "GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry."
    );
  }
  this._length = length;
  this._topRadius = topRadius;
  this._bottomRadius = bottomRadius;
  this._slices = slices;
  this._numberOfVerticalLines = numberOfVerticalLines;
  this._offsetAttribute = options.offsetAttribute;
  this._workerName = "createCylinderOutlineGeometry";
}
CylinderOutlineGeometry.packedLength = 6;
CylinderOutlineGeometry.pack = function(value, array, startingIndex) {
  Check_default.typeOf.object("value", value);
  Check_default.defined("array", array);
  startingIndex = defaultValue_default(startingIndex, 0);
  array[startingIndex++] = value._length;
  array[startingIndex++] = value._topRadius;
  array[startingIndex++] = value._bottomRadius;
  array[startingIndex++] = value._slices;
  array[startingIndex++] = value._numberOfVerticalLines;
  array[startingIndex] = defaultValue_default(value._offsetAttribute, -1);
  return array;
};
var scratchOptions = {
  length: void 0,
  topRadius: void 0,
  bottomRadius: void 0,
  slices: void 0,
  numberOfVerticalLines: void 0,
  offsetAttribute: void 0
};
CylinderOutlineGeometry.unpack = function(array, startingIndex, result) {
  Check_default.defined("array", array);
  startingIndex = defaultValue_default(startingIndex, 0);
  const length = array[startingIndex++];
  const topRadius = array[startingIndex++];
  const bottomRadius = array[startingIndex++];
  const slices = array[startingIndex++];
  const numberOfVerticalLines = array[startingIndex++];
  const offsetAttribute = array[startingIndex];
  if (!defined_default(result)) {
    scratchOptions.length = length;
    scratchOptions.topRadius = topRadius;
    scratchOptions.bottomRadius = bottomRadius;
    scratchOptions.slices = slices;
    scratchOptions.numberOfVerticalLines = numberOfVerticalLines;
    scratchOptions.offsetAttribute = offsetAttribute === -1 ? void 0 : offsetAttribute;
    return new CylinderOutlineGeometry(scratchOptions);
  }
  result._length = length;
  result._topRadius = topRadius;
  result._bottomRadius = bottomRadius;
  result._slices = slices;
  result._numberOfVerticalLines = numberOfVerticalLines;
  result._offsetAttribute = offsetAttribute === -1 ? void 0 : offsetAttribute;
  return result;
};
CylinderOutlineGeometry.createGeometry = function(cylinderGeometry) {
  let length = cylinderGeometry._length;
  const topRadius = cylinderGeometry._topRadius;
  const bottomRadius = cylinderGeometry._bottomRadius;
  const slices = cylinderGeometry._slices;
  const numberOfVerticalLines = cylinderGeometry._numberOfVerticalLines;
  if (length <= 0 || topRadius < 0 || bottomRadius < 0 || topRadius === 0 && bottomRadius === 0) {
    return;
  }
  const numVertices = slices * 2;
  const positions = CylinderGeometryLibrary_default.computePositions(
    length,
    topRadius,
    bottomRadius,
    slices,
    false
  );
  let numIndices = slices * 2;
  let numSide;
  if (numberOfVerticalLines > 0) {
    const numSideLines = Math.min(numberOfVerticalLines, slices);
    numSide = Math.round(slices / numSideLines);
    numIndices += numSideLines;
  }
  const indices = IndexDatatype_default.createTypedArray(numVertices, numIndices * 2);
  let index = 0;
  let i;
  for (i = 0; i < slices - 1; i++) {
    indices[index++] = i;
    indices[index++] = i + 1;
    indices[index++] = i + slices;
    indices[index++] = i + 1 + slices;
  }
  indices[index++] = slices - 1;
  indices[index++] = 0;
  indices[index++] = slices + slices - 1;
  indices[index++] = slices;
  if (numberOfVerticalLines > 0) {
    for (i = 0; i < slices; i += numSide) {
      indices[index++] = i;
      indices[index++] = i + slices;
    }
  }
  const attributes = new GeometryAttributes_default();
  attributes.position = new GeometryAttribute_default({
    componentDatatype: ComponentDatatype_default.DOUBLE,
    componentsPerAttribute: 3,
    values: positions
  });
  radiusScratch.x = length * 0.5;
  radiusScratch.y = Math.max(bottomRadius, topRadius);
  const boundingSphere = new BoundingSphere_default(
    Cartesian3_default.ZERO,
    Cartesian2_default.magnitude(radiusScratch)
  );
  if (defined_default(cylinderGeometry._offsetAttribute)) {
    length = positions.length;
    const offsetValue = cylinderGeometry._offsetAttribute === GeometryOffsetAttribute_default.NONE ? 0 : 1;
    const applyOffset = new Uint8Array(length / 3).fill(offsetValue);
    attributes.applyOffset = new GeometryAttribute_default({
      componentDatatype: ComponentDatatype_default.UNSIGNED_BYTE,
      componentsPerAttribute: 1,
      values: applyOffset
    });
  }
  return new Geometry_default({
    attributes,
    indices,
    primitiveType: PrimitiveType_default.LINES,
    boundingSphere,
    offsetAttribute: cylinderGeometry._offsetAttribute
  });
};
var CylinderOutlineGeometry_default = CylinderOutlineGeometry;

// packages/engine/Source/Workers/createCylinderOutlineGeometry.js
function createCylinderOutlineGeometry(cylinderGeometry, offset) {
  if (defined_default(offset)) {
    cylinderGeometry = CylinderOutlineGeometry_default.unpack(cylinderGeometry, offset);
  }
  return CylinderOutlineGeometry_default.createGeometry(cylinderGeometry);
}
var createCylinderOutlineGeometry_default = createCylinderOutlineGeometry;
export {
  createCylinderOutlineGeometry_default as default
};
