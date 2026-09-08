// Leaflet.PolylineDecorator ArrowHead._buildArrowPath, MIT; see LICENSE.
// Original geometry method below; Leaflet point/projection adapters only.
const L = { point: (x, y) => ({ x, y }) };
const ArrowHead = {
    _buildArrowPath: function (dirPoint, map) {
        const d2r = Math.PI / 180;
        const tipPoint = map.project(dirPoint.latLng);
        const direction = (-(dirPoint.heading - 90)) * d2r;
        const radianArrowAngle = this.options.headAngle / 2 * d2r;

        const headAngle1 = direction + radianArrowAngle;
        const headAngle2 = direction - radianArrowAngle;
        const arrowHead1 = L.point(
            tipPoint.x - this.options.pixelSize * Math.cos(headAngle1),
            tipPoint.y + this.options.pixelSize * Math.sin(headAngle1));
        const arrowHead2 = L.point(
            tipPoint.x - this.options.pixelSize * Math.cos(headAngle2),
            tipPoint.y + this.options.pixelSize * Math.sin(headAngle2));

        return [
            map.unproject(arrowHead1),
            dirPoint.latLng,
            map.unproject(arrowHead2)
        ];
    }
};
const projectedMap = { project: p => p, unproject: p => p };
module.exports = function arrowHead(dirPoint, pixelSize = 10, headAngle = 60) {
    return ArrowHead._buildArrowPath.call(
        { options: { pixelSize, headAngle } },
        { latLng: dirPoint.pt, heading: dirPoint.heading }, projectedMap);
};
