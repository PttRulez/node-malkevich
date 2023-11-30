#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import {FormatEnum} from 'sharp';
import {VALID_FORMATS} from './constants';

const INPUT_FOLDER = './input';
const OUTPUT_FOLDER = './output';

async function convert() {
  const format: keyof FormatEnum = process.argv[2] as keyof FormatEnum;

  if (!format)
    throw new Error("Введите формат (Например 'npm run convert webp')");

  if (!VALID_FORMATS.includes(format))
    throw new Error(
      "Неверный формат! (Доступные форматы: 'heic, heif, avif, jpeg, jpg, jpe, tile, dz, png, raw, tiff, tif, webp, gif, jp2, jpx, j2k, j2c, jxl')"
    );
  const fileNames = fs.readdirSync(INPUT_FOLDER);

  for (const fileName of fileNames) {
    const filePath = path.join(INPUT_FOLDER, fileName);
    const outputFodler = path.join(OUTPUT_FOLDER, format);

    if (!fs.existsSync(outputFodler)) {
      fs.mkdirSync(outputFodler);
    }

    const outputFilePath = path.join(
      outputFodler,
      path.parse(fileName).name + '.' + format
    );

    try {
      await sharp(filePath)
        .toFormat(format, {mozjpeg: true})
        .toFile(outputFilePath);
    } catch (e: any) {
      console.log(e.message);
      break;
    }
  }
}

async function start() {
  try {
    await convert();
  } catch (e: any) {
    console.log(e.message);
  }
}

start();
