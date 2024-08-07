import { Component, Input } from '@angular/core';
import { Size } from '../../enums/size.enum';

@Component({
  selector: 'app-em-loader',
  standalone: true,
  imports: [],
  templateUrl: './em-loader.component.html',
  styleUrl: './em-loader.component.scss'
})
export class EmLoaderComponent {
  @Input() size: Size = Size.Large;
  public Size = Size;
}
