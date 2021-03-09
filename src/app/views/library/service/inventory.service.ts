import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor() { }
  public languageType = localStorage.getItem('language')
  data:any= {}

  /** config /dashboard-inventory/product-data */
  public configInventoryProduct() {
    if (this.languageType == '0') {
      this.data['titleInformation']='Informasi Produk'
      this.data['titleVariant']='Variasi Produk'
      this.data['titleImage']='Gambar Produk'
      this.data['masterProduct'] = {
        'product_name':'Nama Produk','image_product':'Gambar Produk','base_unit':'Satuan Dasar',
        'product_category_id':'Kategori Produk','description':'Keterangan',
        'sell_price':'Harga Jual','base_price':'Harga Beli','is_active':'Status Product',
        'spesification':'Spesifikasi Produk',
        'variant':'Variasi Produk','variantOne':'Variasi 1','variantTwo':'Variasi 2',
        'infoVariant':'Informasi Variasi','stock':'Stok','sku':'SKU','image':'Gambar',
        'delivery_minimum':'Minimal Pemesanan','unit_price':'Harga Satuan','stock_product':'Stok Produk','weight':'Berat',
        'stock_minimum':'Stok Minimal','titleSpesification':'Tambah Spesifikasi Produk','name':'Nama Spesifikasi',
        'wholesale':'Harga Grosir','product_size':'Ukuran Produk','sales_tax':'Pajak Penjualan','purchase_tax':'Pajak Pembelian'
      }
      this.data['button'] = {
        'btnSpesification':'Tambah Spesifikasi Produk','btnVariant':'Aktifkan Variasi Produk',
        'btnVariantDisable':'Nonaktifkan Variasi Produk','btnWholesale':'Tambah Harga Grosir',
        'btnDelete':'Hapus'
      }
      this.data['columnTable'] = ['KODE BARANG','NAMA BARANG','KATEGORI','HARGA JUAL','KETERSEDIAAN','STATUS','']
    } else {

    }
    return this.data
  }

  /** config /dashboard-inventory/inventory-summary */
  public configInventorySummary() {
    if (this.languageType == '0') {
      this.data['titleInformation'] = 'Ringkasan Data Produk'
      this.data['columnTable'] = ['NAMA PRODUK', 'SKU', 'VARIANT 1', 'VARIANT 2', 'STOCK BEGINNING', 'STOCK IN', 'STOCK OUT', 'STOCK ON HAND']
    }

    return this.data
  }

  /** config /dashboard-inventory/inventory-adjustment */
  public configInventoryAdjustment() {
    if (this.languageType == '0') {
      this.data['titleInformation'] = 'Penyesuaian Barang'
      this.data['titleCreate'] = 'Tambah'
      this.data['columnTable'] = ['TANGGAL', 'NO. PENYESUAIAN BARANG', 'GUDANG', 'AKSI',]
    }

    return this.data
  }

  /** config /dashboard-inventory/plan-stock-opname */
  public configInventoryOpname() {
    if (this.languageType == '0') {
      this.data['titleInformation'] = 'Perintah Stock Opname'
      this.data['columnTable'] = ['TANGGAL', 'NOMOR', 'TANGGAL MULAI', 'GUDANG', 'STATUS', '']
      this.data['titleCreate'] = 'Tambah Perintah'
    }

    return this.data
  }

  /** config /dashboard-inventory/result-stock-opname */
  public configInventoryResultOpname() {
    if (this.languageType == '0') {
      this.data['titleInformation'] = 'Hasil Stock Opname'
      this.data['titleCreate'] = 'Tambah'
      this.data['columnTable'] = ['TANGGAL', 'NO. STOCK OPNAME', 'DATA GUDANG', 'STATUS', '']
    }

    return this.data
  }

  
  public configLogistics() {
    if (this.languageType == '0') {
      this.data['titleInformation']='Informasi Logistic'
      this.data['titleCreate']='Tambah Logistic'
      this.data['titleUpdate']='Edit Logistic'
      this.data['master'] = {
        'name_courier':'Nama Kurir','type_delivery':'Jenis Pengiriman',
      }
      this.data['button'] = {
        'btnCreate':'TAMBAH','btnUpdate':'EDIT','btnDelete':'HAPUS'
      }
      this.data['columnTable'] = ['#','NAMA KURIR','JENIS PENGIRIMAN','TANGGAL DIBUAT','TANGGAL DIPERBARUI','']
    } else {

    }
    return this.data
  }
  public configCategoryProduct() {
    if (this.languageType == '0') {
      this.data['titleInformation']='Informasi Kategori Produk'
      this.data['titleCreate']='Tambah Kategori Produk'
      this.data['titleUpdate']='Edit Kategori Produk'
      this.data['master'] = {
        'name':'Nama Kategori Produk','is_active':'Status',
      }
      this.data['button'] = {
        'btnCreate':'TAMBAH','btnUpdate':'EDIT','btnDelete':'HAPUS'
      }
      this.data['columnTable'] = ['NAMA','SUB KATEGORI DARI','STATUS','']
    } else {

    }
    return this.data
  }
}
