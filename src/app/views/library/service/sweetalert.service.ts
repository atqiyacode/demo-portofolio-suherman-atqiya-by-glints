import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor(
  ) { }
  showSuccess(message) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2500,
    });
  }

  showError(message) {
    Swal.fire({
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2500,
    });
  }
}
