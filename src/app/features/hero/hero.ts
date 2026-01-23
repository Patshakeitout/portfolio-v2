import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { Header } from '../../core/layout/header/header';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, Header],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {

}
