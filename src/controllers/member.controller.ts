import { Controller, Get, UseGuards, Req, Post, Body, Query, Param, Put, Delete, Header, Headers, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RoleGuard } from '../guards/role.guard';
import { RoleAccount, IAccount } from '../interfaces/app.interface';
import { IMemberDocument } from '../interfaces/member.interface';
import { AddressModel } from '../models/address.model';
import { ChangePasswordModel } from '../models/change-password.model';
import { ChangeRSAkeyModel } from '../models/change-rsakey.model';
import { CreateMemberModel, ParamMemberModel, UpdateMemberModel } from '../models/member.model';
import { ProfileModel } from '../models/profile.model';
import { SearchModel } from '../models/search.model';
import { MemberService } from '../services/member.service';


@Controller('api/member')
@UseGuards(AuthGuard('jwt'))
export class MemberController {
    constructor(private service: MemberService) { }

    @Get('data') // แสดงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
    getUserLogin(@Req() req: Request) {
        const userLogin: IMemberDocument = req.user as any;
        userLogin.password = '';
        return userLogin;
    }

    @Post('profile') // แก้ไขหน้าโปรไฟล์
    updateProfile(@Req() req: Request, @Body(new ValidationPipe()) body: ProfileModel) {
        return this.service.onUpdateProfile(req.user['id'], body);
    }

    // แก้ไขสถานที่ติดตั้ง
    @Post('address')
    updateAddress(@Req() req: Request, @Body(new ValidationPipe()) body: AddressModel) {
        return this.service.onChangeAddress(req.user['id'], body);
    }

    @Post('change-password') // เปลี่ยนรหัสผ่าน
    changePassword(@Req() req: Request, @Body(new ValidationPipe()) body: ChangePasswordModel) {
        return this.service.onChangePassword(req.user['id'], body);

    }

    // หน้าแสดงและแก้ไข RSA key
    @Post('rsa-key')
    @UseGuards(new RoleGuard(RoleAccount.Member))
    changeRSAkey(@Req() req: Request, @Body(new ValidationPipe()) body: ChangeRSAkeyModel) {
        return this.service.onChangeRSAkey(req.user['id'], body);
    }

    @Get() // แสดงข้อมูลรายการสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Superadmin))
    showMember(@Query(new ValidationPipe()) query: SearchModel) {
        query.startPage = parseInt(query.startPage as any);
        query.limitPage = parseInt(query.limitPage as any);
        return this.service.getMemberItems(query);
    }

    @Post() // เพิ่มข้อมูลสมาชิก
    @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Superadmin))
    createMember(@Body(new ValidationPipe()) body: CreateMemberModel, @Headers() accessToken: any) {
        return this.service.createMemberItem(body, accessToken['authorization']);
    }

    @Get(`:id`) // แสดงข้อมูลสมาชิกเดี่ยว
    @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Superadmin))
    showMemberById(@Param(new ValidationPipe()) param: ParamMemberModel) {
        return this.service.getMemberItem(param.id);
    }

    @Put(`:id`) // แก้ไขข้อมูลสมาชิกเดี่ยว
    @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Superadmin))
    updateMember(@Param(new ValidationPipe()) param: ParamMemberModel, @Body(new ValidationPipe()) body: UpdateMemberModel, @Headers() accessToken: any) {
        return this.service.updateMemberItem(param.id, body, accessToken['authorization']);
    }

    @Delete(`:id`) // ลบข้อมูลสมาชิกเดี่ยว
    @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Superadmin))
    deldeteMember(@Param(new ValidationPipe()) param: ParamMemberModel, @Headers() accessToken: any) {
        return this.service.deleteMemberItem(param.id, accessToken['authorization']);
    }

    @Post(`:id`) // อัพเดตแฟลก
    @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Superadmin))
    updateFlag(@Param(new ValidationPipe()) param: ParamMemberModel, @Body() flagrsa: IAccount, @Headers() accessToken: any) {
        return this.service.updataFlagofMemberItem(param.id, accessToken['authorization']);
    }


}