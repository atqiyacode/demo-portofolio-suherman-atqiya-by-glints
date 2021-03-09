import { Component,  OnInit,} from '@angular/core';
import * as forms from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ContentServiceService } from '../../../../library/service/content-service.service';
import { ApiBackendService } from '../../../../../auth/api-backend.service';
import { SweetAlertService } from '../../../../library/service/sweetalert.service';

declare let $: any;
@Component({
  selector: 'app-privacy-policy-setting',
  templateUrl: './about-us.component.html',
  styleUrls: ['../../content-setting.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    public content: ContentServiceService,
    private apiBackend: ApiBackendService,
    public fb: forms.FormBuilder,
    private notify: SweetAlertService,
    private activatedRoute: ActivatedRoute,
  ) {
    
  }

  resBackend: any;
  footerTitle = '';
  footerContent = '';
  footerSlug = '';
  footerStatus: number;

  formFooter = this.fb.group({
    title: ['', forms.Validators.required],
    content: ['', forms.Validators.required],
    is_active: ['', forms.Validators.required],
    slug: ['', forms.Validators.required],
    id: [''],
  });

  ngOnInit(): void {
    this.slug = 'kebijakan-privasi';
    this.getFooter();
    $('#collapseExample').collapse('hide');
    $('#collapseFooter').collapse('show');
    $('#landing-page').removeClass('active');
    $('#promo-page').removeClass('active');
    $('#footer-page').addClass('active');
    $('#discount-page').removeClass('active');
    $('.summernote').summernote({
      height: 300,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture']],
        ['view', ['fullscreen', 'codeview', 'help']],
        ['height', ['height']],
      ],
      callbacks: {
        onImageUpload(image) {
          const form = new FormData();
          form.append('file', image[0]);
          form.append('path', 'brand');

          const settings = {
            url: 'https://api.quantumdigitech.com/bc/api/upload',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + this.tokenAuth,
            },
            processData: false,
            mimeType: 'multipart/form-data',
            contentType: false,
            data: form,
          };

          $.ajax(settings).done(response => {
            const url = JSON.parse(response);
            $('.summernote').summernote('insertImage', url.data.file);
          });
        },
      },
    });
  }

  slug: any;
  getFooter() {
    const url = `pages/${this.apiBackend.serviceAuth().tenant_id}/detail/${this.slug}`;
    this.apiBackend.Show(url).subscribe(
      (data: {}) => {
        this.resBackend = data;
        this.formFooter.get('id').setValue(this.resBackend.data.id);
        this.formFooter.get('title').setValue(this.resBackend.data.title);
        this.formFooter.get('is_active').setValue(this.resBackend.data.is_active);
        this.formFooter.get('content').setValue(this.resBackend.data.content);
        this.formFooter.get('slug').setValue(this.resBackend.data.slug);
        this.footerTitle = this.resBackend.data.title;
        this.footerSlug = this.resBackend.data.slug;
        this.footerStatus = this.resBackend.data.is_active;
        $('#footer-content').summernote('code', this.resBackend.data.content);
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  submitFooter() {
    this.formFooter.get('content').setValue($('#footer-content').val());
    const idFooter = this.formFooter.value.id;
    const updateFooterUrl = `pages/${this.apiBackend.serviceAuth().tenant_id}/update/${idFooter}`;
    this.apiBackend.Update(this.formFooter.value, updateFooterUrl).subscribe(
      (data: {}) => {
        this.resBackend = data;
        if (this.resBackend.status === 200) {
          this.notify.showSuccess('Footer Berhasil Diupdate')
          this.getFooter();
        } else {
          this.notify.showError(this.resBackend.message)
        }
      },
      (err) => {
        this.notify.showError(err)
      }
    );
  }

  onChangeFooterStatus(e) {
    this.footerStatus = e;
    this.formFooter.get('is_active').setValue(e);
  }



}
