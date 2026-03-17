import { Controller, Get, Req } from "@nestjs/common";
import { EligibilityService } from "./services/eligibility.service";
import type { Request } from "express";

type RequestWithUser = Request & { user: { id: string, tenantId?: string } };
type ScreenType = 'A' | 'B' | 'C';

@Controller()
export class EligibilityController {
    constructor(
        private readonly eligibilityService: EligibilityService
    ) {}

    @Get('screen-a')
    async getScreenA(@Req() req: RequestWithUser) {
        return this.buildScreenResponse(req, 'A');
    }

    @Get('screen-b')
    async getScreenB(@Req() req: RequestWithUser) {
        return this.buildScreenResponse(req, 'B');
    }

    @Get('screen-c')
    async getScreenC(@Req() req: RequestWithUser) {
        return this.buildScreenResponse(req, 'C');
    }

    private async buildScreenResponse(req: RequestWithUser, screen: ScreenType) {
        const userId = req.user.id;
        const tenantId = req.user.tenantId;

        const eligbility = await this.eligibilityService.getEligibilityForuser(
            userId,
            tenantId
        );

        return {
            screen,
            eligbility
        }
    }
}
