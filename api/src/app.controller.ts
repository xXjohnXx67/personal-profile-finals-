import { Controller, Get, Post, Body } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Controller('guestbook')
export class AppController {
  // Use environment variables for security
  private supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  @Get()
  async getMessages() {
    const { data } = await this.supabase.from('guestbook').select('*').order('created_at', { ascending: false });
    return data;
  }

  @Post()
  async addMessage(@Body() body: { name: string; message: string }) {
    const { data } = await this.supabase.from('guestbook').insert([body]);
    return data;
  }
}