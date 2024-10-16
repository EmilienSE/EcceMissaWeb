import { Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent {
  @Input() message!: string; // Propriété pour recevoir le message
  @Input() type!: 'success' | 'danger'; // Propriété pour le type de notification

  constructor(private element: ElementRef) {}

  close() {
    this.element.nativeElement.remove(); // Supprime le composant du DOM
  }
}
