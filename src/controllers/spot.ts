import {Get, Delete, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import {Spot, SpotRequest} from '../models/spot';
import {createSpot, deleteSpot} from '../services/spot';

@Route('spots')
export class SpotController extends Controller {

    @Post()
    public async createSpot(@Body() requestBody: SpotRequest): Promise<Spot> {
        this.setStatus(201); // set return status 201
        return createSpot(requestBody).then(resp => {
            return resp.ops;
        });
    }

    @Delete('{spotId}')
    public async deleteSpot(spotId: string): Promise<void> {
        return deleteSpot(spotId);
    }
}