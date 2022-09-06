import { BadRequestException } from "@nestjs/common";

export function checkValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) throw new BadRequestException('Invalid date format'); // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) throw new BadRequestException('Invalid date format'); // Invalid formatNaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}
