import {Get, Delete, Post, Route, Body, Query, Header, Path, SuccessResponse, Controller } from 'tsoa';
import {getNearestParty} from '../services/spot';
import {FlashParty} from '../models/flashparty';

@Route('party')
export class PartyController extends Controller {

    @Get('{coordinates}')
    public async getParty(coordinates: string): Promise<FlashParty> {
        const [lon, lat] = coordinates.split(',');
        return getNearestParty(lon, lat);
    }
}