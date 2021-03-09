import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor() { }
  public languageType = localStorage.getItem('language')
  data:any= {}

  public configContact() {
    if (this.languageType == '0') {
      this.data['titleInformation']='Data Kontak'
      this.data['titleSales'] = "Sales"
      this.data['titleSupplier'] = "Supplier"
      this.data['titleCustomer'] = "Customer"
      this.data['titleCreate']='Tambah'
      this.data['titleUpdate']='Edit'
      this.data['form'] = {
        'name_cust':'Nama Pelanggan','noBid':'No Penawaran','date':'Tanggal','invoiceNo':'No Pesanan','warehouse':'Dari Gudang',
        'product':'Produk','variant':'Varian','total':'Jumlah','unitPrice':'Harga Satuan','totalOrder':'Total Pesanan','weight':'Berat',
        'subTotal':'subTotal Harga Produk','totalPostalFee':'Total Ongkos Kirim','handlingFee':'Biaya Penanganan','taxTotal':'Total Pajak',
        'selectPayment':'Pilih Pembayaran'
      }
      this.data['button'] = {
        'btnCreate':'TAMBAH','btnUpdate':'EDIT','btnDelete':'HAPUS'
      }
      this.data['columnSales'] = ['Nama','Kode','Email','Telepon','Action']
      this.data['columnCustomer'] = ['Nama','Kode','Email','Telepon','Action']
    } else {

    }
    return this.data
  }
}
