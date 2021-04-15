import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMemberDocument } from '../interfaces/member.interface';
import { IAccount, IForgot, ILogin, IRegister } from '../interfaces/app.interface';
import { generate, verify } from 'password-hash';
import { JwtAuthenService } from './jwt.authen.service';
import * as f from 'fs';

@Injectable()
export class AppService {
  constructor(
    private authenService: JwtAuthenService,
    @InjectModel('Member') private MemberCollection: Model<IMemberDocument>
  ) { }

  public logger = new Logger(AppService.name);

  // ลงทะเบียน
  async onRegister(body: IRegister) {
    const count = await this.MemberCollection.count({ username: body.username });
    if (count > 0) throw new BadRequestException('มีผู้ใช้นี้ในระบบแล้ว');

    let model: IRegister = body;
    model.password = body.password;
    model.username = body.username;
    model.role = body.role;
    model.firstname = '';
    model.lastname = '';
    model.telphone = '';
    model.email = '';
    model.facebook = '';
    model.line = '';
    model.image = '';
    model.created = new Date();
    model.updated = model.created;
    model.password = generate(model.password);
    const modelItem = await this.MemberCollection.create(model);
    modelItem.id = modelItem._id;
    await this.MemberCollection.create(modelItem);
    modelItem.password = '';

    // เก็บ Log file
    const dataForLog = await this.MemberCollection.findOne({ username: body.username });
    const data = new Uint8Array(Buffer.from(
      ` เวลา ${new Date()} จาก {api/account/create-registerad-aseanivo, POST} ลงทะเบียน ${dataForLog.username} [id: ${dataForLog.id}] \n`
    ));
    f.open('log/userlog.log', 'a', (err, fd) => {
      f.appendFile(fd, data, `utf8`, (err) => {
        f.close(fd, (err) => {
          if (err) throw err;
        });
        if (err) throw err;
      });
      if (err) throw err;
    });


    return modelItem;
  }

  async onLogin(body: ILogin) {
    const member = await this.MemberCollection.findOne({ username: body.username });
    if (!member) throw new BadRequestException('ไม่พบข้อมูลการลงทะเบียนของผู้ใช้นี้');
    if (verify(body.password, member.password)) {
      await this.MemberCollection.updateOne({ username: body.username }, {
        updated: new Date(),
      });

      // เก็บ Log file
      const dataForLog = await this.MemberCollection.findOne({ username: body.username });
      const accessTokenGenerate = await this.authenService.generateAccessToken(member);
      const data = new Uint8Array(Buffer.from(
        ` เวลา ${new Date()} จาก {api/account/login, POST} ผู้ใช้ ${dataForLog.username} [id: ${dataForLog.id}] AccessToken [${accessTokenGenerate}] : Login เข้าสู่ระบบ \n`
      ));
      f.open('log/userlog.log', 'a', (err, fd) => {
        f.appendFile(fd, data, `utf8`, (err) => {
          f.close(fd, (err) => {
            if (err) throw err;
          });
          if (err) throw err;
        });
        if (err) throw err;
      });

      return { accessToken: accessTokenGenerate };
    }
    throw new BadRequestException('บัญชีผู้ใช้้หรือรหัสผ่านไม่ถูกต้อง');
  }

  async onForgot(body: IForgot) {
    const member = await this.MemberCollection.findOne({ username: body.username });
    if (!member) throw new BadRequestException('ไม่พบข้อมูลการลงทะเบียนของผู้ใช้นี้');
    // console.log(body.macaddress);
    // console.log(member.macaddress);
    if (verify(body.macaddress, member.hashmac)) {
      const updated = await this.MemberCollection.updateOne({ _id: member.id }, <IAccount>{
        password: generate(body.newpassword)
      });

      // เก็บ Log file
      const dataForLog = await this.MemberCollection.findOne({ username: body.username });
      const data = new Uint8Array(Buffer.from(
        ` เวลา ${new Date()} จาก {api/account/forgot-password, POST} ผู้ใช้ ${dataForLog.username} [id: ${dataForLog.id}] : ทำการรีเซ็ทรหัสผ่าน \n`
      ));
      f.open('log/userlog.log', 'a', (err, fd) => {
        f.appendFile(fd, data, `utf8`, (err) => {
          f.close(fd, (err) => {
            if (err) throw err;
          });
          if (err) throw err;
        });
        if (err) throw err;
      });

      return updated;
    }
    throw new BadRequestException('กรอกข้อมูลบางอย่างผิดพลาด กรุณากรอกใหม่');
  }
}
