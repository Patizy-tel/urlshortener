import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class UrlShortener extends Document {
  @Prop({ required: true, unique: true })
  longURL: string;

  @Prop({ required: true, unique: true })
  shortURL: string;

  @Prop({ type: Number, default: 0 })
  clicks: number;
}

export const urlShortenerSchema = SchemaFactory.createForClass(UrlShortener);
