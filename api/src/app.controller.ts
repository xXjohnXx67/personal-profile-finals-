import { Controller, Get, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Controller('guestbook')
export class AppController {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase keys are missing from environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  @Get()
  async getMessages() {
    const { data, error } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  @Post()
  async addMessage(@Body() body: { name: string; comment: string }) { // match your frontend field
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([body]);

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}