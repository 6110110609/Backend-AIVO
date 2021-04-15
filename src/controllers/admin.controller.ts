import { Body, Controller, Get, Headers, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { RoleGuard } from "../guards/role.guard";
import { RoleAccount } from "../interfaces/app.interface";
import { AdminProfileModel } from "../models/admin-profile.model";
import { UpdateAdminModel, CreateAdminModel } from "../models/admin.model";
import { ParamMemberModel } from "../models/member.model";
import { SearchModel } from "../models/search.model";
import { AdminService } from "../services/admin.service";


@Controller('api/admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
    constructor(private service: AdminService) { }

    @Get() // แสดงข้อมูลรายการสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    showAdmin(@Query(new ValidationPipe()) query: SearchModel) {
        query.startPage = parseInt(query.startPage as any);
        query.limitPage = parseInt(query.limitPage as any);
        return this.service.getAdminItems(query);
    }

    @Put(`:id`) // แก้ไขข้อมูลสมาชิกเดี่ยว
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    updateAdmin(@Param(new ValidationPipe()) param: ParamMemberModel, @Body(new ValidationPipe()) body: UpdateAdminModel, @Headers() accessToken: any) {
        return this.service.updateAdminItem(param.id, body, accessToken['authorization']);
    }

    @Post() // เพิ่มข้อมูลสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Superadmin))
    createAdmin(@Body(new ValidationPipe()) body: CreateAdminModel, @Headers() accessToken: any) {
        return this.service.createAdminItem(body, accessToken['authorixation']);
    }

    @Post('profile-admin') // แก้ไขหน้าโปรไฟล์
    updateAdminProfile(@Req() req: Request, @Body(new ValidationPipe()) body: AdminProfileModel) {
        return this.service.onUpdateAdminProfile(req.user['id'], body);
    }


}