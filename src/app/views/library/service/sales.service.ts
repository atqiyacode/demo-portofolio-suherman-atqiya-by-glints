import { Injectable } from '@angular/core';

import { MenuDashboardService } from "../service/menu-dashboard.service";
@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
    public menu:MenuDashboardService
  ) { }
  public languageType = localStorage.getItem('language')
  data:any= {}

  public configSalesOrder() {
    if (this.languageType == '0') {
      this.data['titleInformation']='Pesanan Penjualan'
      this.data['titleCreate']='Tambah Pesanan'
      this.data['titleInformationQuotation']='Penawaran Harga'
      this.data['titleCreateQuotation']='Tambah Penawaran'
      this.data['titleInformationDelivery']='Pengiriman Barang'
      this.data['titleCreateDelivery']='Tambah Pengiriman'
      this.data['form'] = {
        'name_cust':'Nama Pelanggan','noBid':'No Penawaran','date':'Tanggal','invoiceNo':'No Pesanan','warehouse':'Dari Gudang',
        'product':'Produk','variant':'Varian','total':'Jumlah','unitPrice':'Harga Satuan','totalOrder':'Total Pesanan','weight':'Berat',
        'subTotal':'SubTotal Harga Produk','totalPostalFee':'Total Ongkos Kirim','handlingFee':'Biaya Penanganan','taxTotal':'Total Pajak',
        'selectPayment':'Pilih Pembayaran','approved':'Approved','denied':'Denied','endTotal':'Total Pesanan','deliveryNo':'No Pengiriman'
      }
      this.data['button'] = {
        'btnCreate':'TAMBAH','btnUpdate':'EDIT','btnDelete':'HAPUS'
      }
      this.data['columnTable'] = ['TANGGAL','NO.PESANAN','NAMA/TOKO PELANGGAN','TOTAL PESANAN','STATUS','']
      this.data['columnTableQuotation'] = ['TANGGAL','NO.PENAWARAN','NAMA/TOKO PELANGGAN','TOTAL PESANAN','STATUS','']
      this.data['columnTableDo'] = ['TANGGAL','NO.PENGIRIMAN','NAMA/TOKO PELANGGAN','TOTAL PESANAN','STATUS','']
    } else {

    }
    return this.data
  }
}
