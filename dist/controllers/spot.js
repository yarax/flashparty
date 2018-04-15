"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const spot_1 = require("../services/spot");
let SpotController = class SpotController extends tsoa_1.Controller {
    createSpot(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setStatus(201); // set return status 201
            return spot_1.createSpot(requestBody).then(resp => {
                return resp.ops;
            });
        });
    }
    deleteSpot(spotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return spot_1.deleteSpot(spotId);
        });
    }
};
__decorate([
    tsoa_1.Post(),
    __param(0, tsoa_1.Body())
], SpotController.prototype, "createSpot", null);
__decorate([
    tsoa_1.Delete('{spotId}')
], SpotController.prototype, "deleteSpot", null);
SpotController = __decorate([
    tsoa_1.Route('spots')
], SpotController);
exports.SpotController = SpotController;
//# sourceMappingURL=spot.js.map