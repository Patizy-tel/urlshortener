import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class UrlShortener extends Document {
  @Prop({ required: true })
  longURL: string;

  @Prop({ required: true })
  shortURL: string;
}

export const urlShortenerSchema = SchemaFactory.createForClass(UrlShortener);
