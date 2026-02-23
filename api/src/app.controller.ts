import { Controller, Get, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Controller('guestbook')
export class AppController {
  private supabaseUrl = process.env.SUPABASE_URL;
  private supabaseKey = process.env.SUPABASE_KEY;

  @Get()
  async getMessages() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new InternalServerErrorException('Supabase keys are missing');
    }
    const supabase = createClient(this.supabaseUrl, this.supabaseKey);
    const { data, error } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  @Post()
  async addMessage(@Body() body: { name: string; message: string }) {
    const supabase = createClient(this.supabaseUrl!, this.supabaseKey!);
    const { data, error } = await supabase.from('guestbook').insert([body]);
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}  