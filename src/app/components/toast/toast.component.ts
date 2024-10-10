import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  @Input() toastType: 'positive' | 'negative' = 'positive';
  message: string = '';
  isVisible: boolean = false;

  showToast(msg: string) {
    this.message = msg;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
      this.message = '';
    }, 5000); // Duration for which the toast is visible
  }
}
