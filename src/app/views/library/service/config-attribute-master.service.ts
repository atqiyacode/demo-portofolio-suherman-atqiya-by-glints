import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigAttributeInventoryService {

  constructor() { }
  data = {}
  idLanguage = '0'
  iconBtnCreate = 'fa fa-user-plus'
  columnTable = []
  modalForm = {}
  public languageType = localStorage.getItem('language')
  public attributeModal = {'id': 0, 'colorHeader':'', 'colorBtn':'', 'titleBtn':'', 'textHeader':''}
  attributeModalCreate = {'id': 1, 'colorHeader':'bg-info', 'colorBtn':'primary', 'titleBtn':'Tambah', 'textHeader':'Tambah '}
  attributeModalEdit = {'id': 2, 'colorHeader':'bg-warning', 'colorBtn':'warning', 'titleBtn':'Edit', 'textHeader':'Edit '}
  attributeModalDelete = {'id': 3, 'colorHeader':'bg-danger', 'colorBtn':'danger', 'titleBtn':'Hapus', 'textHeader':'Hapus '}


  public configDepartment() {
    if (localStorage.getItem('language') == this.idLanguage) {
      this.data['column'] = this.columnTable = ['#','NAMA','KODE','SUB DEPARTMENT','PENANGGUNG JAWAB','STATUS','']
      this.data['modal'] =this.modalForm = {'department_name':'NAMA','department_code':'KODE','department_sub':'SUB DEPARTMENT',
      'department_pic':'PENANGGUNG JAWAB','is_active':'AKTIF'}
      this.data['attributeCreate'] = this.attributeModalCreate
      this.data['attributeEdit'] = this.attributeModalEdit
      this.data['attributeDelete'] = this.attributeModalDelete
      this.data['iconBtnCreate'] = this.iconBtnCreate
    } else {
      this.data['column'] = this.columnTable = ['#','NAMA','KODE','SUB DEPARTMENT','PENANGGUNG JAWAB','STATUS','']
      this.data['modal'] =this.modalForm = {'department_name':'NAMA','department_code':'KODE','department_sub':'SUB DEPARTMENT',
      'department_pic':'PENANGGUNG JAWAB','is_active':'AKTIF'}
      this.data['attributeCreate'] = this.attributeModalCreate
      this.data['attributeEdit'] = this.attributeModalEdit
      this.data['attributeDelete'] = this.attributeModalDelete
      this.data['iconBtnCreate'] = this.iconBtnCreate
    }
    return this.data
  }
  public configTax() {
    if (localStorage.getItem('language') == this.idLanguage) {
      this.data['column'] = this.columnTable = ['#','NAMA','KODE','PRESENTASE PAJAK','STATUS','']
      this.data['modal'] =this.modalForm = {'tax_name':'NAMA','tax_code':'KODE',
      'tax_percentage':'PERSENTASE PAJAK','is_purchase_tax':'AKUN PAJAK PEMBELIAN','purchase_account_id':'PEMBELIAN AKUN',
      'is_sales_tax':'AUN PAJAK PENJUALAN','sales_tax_account_id':'PENJUALAN AKUN','is_active':'AKTIF'}
      this.data['attributeCreate'] = this.attributeModalCreate
      this.data['attributeEdit'] = this.attributeModalEdit
      this.data['attributeDelete'] = this.attributeModalDelete
      this.data['iconBtnCreate'] = this.iconBtnCreate
    } else {
      this.data['column'] = this.columnTable = ['#','NAMA','KODE','PRESENTASE PAJAK','STATUS','']
      this.data['modal'] =this.modalForm = {'tax_name':'NAMA','tax_code':'KODE',
      'tax_percentage':'PERSENTASE PAJAK','is_purchase_tax':'AKUN PAJAK PEMBELIAN','purchase_account_id':'PEMBELIAN AKUN',
      'is_sales_tax':'AUN PAJAK PENJUALAN','sales_tax_account_id':'PENJUALAN AKUN','is_active':'AKTIF'}
      this.data['attributeCreate'] = this.attributeModalCreate
      this.data['attributeEdit'] = this.attributeModalEdit
      this.data['attributeDelete'] = this.attributeModalDelete
      this.data['iconBtnCreate'] = this.iconBtnCreate
    }
    return this.data
  }
  public configProduct() {
    if (localStorage.getItem('language') == this.idLanguage) {
      this.data['column'] = this.columnTable = ['#','NAMA','KODE','KATEGORI','HARGA JUAl','JUMLAH TERSEDIA','STATUS','']
      this.data['modal'] = {'product_name':'Nama Produk','product_code':'Kode Produk','base_unit':'Satuan Dasar',
      'product_category_id':'Kelompok Produk','supplier_id':'Pilih Pemasok','description':'Deskripsi','is_controller_stock':'Lacak persediaan/ kontrol stok',
      'sales_tax_id':'Pajak Penjualan','purchase_tax_id':'Pajak Pembelian','stock_minimum':'Stok Minimal','sell_price':'Harga Jual',
      'buy_price':'Harga Beli','stock_in':'Stok Masuk','stock_out':'Stok Keluar','stock_total':'Total Stok','weight':'Berat','slug':'Slug'
      }
      this.data['alertModalForm'] = 'Harus Di Isi'
      this.data['attributeCreate'] = this.attributeModalCreate
      this.data['attributeUpdate'] = this.attributeModalEdit
      this.data['attributeDelete'] = this.attributeModalDelete
      this.data['iconBtnCreate'] = this.iconBtnCreate
      this.data['titleCreate'] = 'Tambah '
      this.data['titleUpdate'] = 'Edit '
      this.data['titleDelete'] = 'Hapus '
      this.data['formTitle'] = 'Data Produk'
    } else {
      this.data['column'] = this.columnTable = ['#','NAME','CODE','CATEGORY','SELLING PRICE','AVAILABLE QTY','STATUS','']
      this.data['modal'] = {'product_name':'Product Name','product_code':'Product Code','base_unit':'Base Unit',
      'product_category':'Product Category','selling_price':'Selling Price','unit_cost':'Unit Cost','supplier':'Choose Supplier',
      'track':'Track Inventory/ Control Stock'}
      this.data['alertModalForm'] = 'Is Required'
      this.data['attributeCreate'] = this.attributeModalCreate
      this.data['attributeUpdate'] = this.attributeModalEdit
      this.data['attributeDelete'] = this.attributeModalDelete
      this.data['iconBtnCreate'] = this.iconBtnCreate
      this.data['titleCreate'] = 'Create '
      this.data['titleUpdate'] = 'Update '
      this.data['titleDelete'] = 'Delete '
      this.data['formTitle'] = 'Product Data'
    }
    return this.data
  }
}
