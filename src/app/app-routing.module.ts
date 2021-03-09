import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/*LOGIN */
import { LoginComponent } from './views/feature/login/login.component';
import { AuthLoginGuard } from './auth/auth-login.guard';
/*========*/

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './views/feature/home/home.component';
import { InventoryComponent } from './views/feature/inventory/inventory.component';
import { ProductComponent } from './views/feature/inventory/product/product.component';
import { FormProductComponent } from './views/feature/inventory/product/form-product/form-product.component';

/*INVENTORY MODULE*/
import { LogisticsComponent } from './views/feature/inventory/logistics/logistics.component';
import { FormLogisticsComponent } from './views/feature/inventory/logistics/form-logistics/form-logistics.component';
/*SALES MODULE*/
import { SalesComponent } from './views/feature/sales/sales.component';
import { SalesOrderComponent } from './views/feature/sales/sales-order/sales-order.component';
import { FormOrderComponent } from './views/feature/sales/sales-order/form-order/form-order.component';
import { SalesQuotationComponent } from './views/feature/sales/sales-quotation/sales-quotation.component';
/*MASTER MODULE */
import { MasterComponent } from './views/feature/master/master.component';
import { ContactComponent } from './views/feature/master/contact/contact.component';
import { FormQuotationComponent } from './views/feature/sales/sales-quotation/form-quotation/form-quotation.component';
import { DeliveryOrderComponent } from './views/feature/sales/delivery-order/delivery-order.component';
import { FormDeliveryComponent } from './views/feature/sales/delivery-order/form-delivery/form-delivery.component';
import { WarehouseComponent } from './views/feature/master/warehouse/warehouse.component';
import { BrandComponent } from './views/feature/master/brand/brand.component';
import { CategoryProdukComponent } from './views/feature/master/category-produk/category-produk.component';
import { PurchaseComponent } from './views/feature/purchase/purchase.component';
import { InventorySummaryComponent } from './views/feature/inventory/inventory-summary/inventory-summary.component';
import { InventoryAdjustmentComponent } from './views/feature/inventory/inventory-adjustment/inventory-adjustment.component';
import { FormInventoryAdjustmentComponent } from './views/feature/inventory/inventory-adjustment/form-inventory-adjustment/form-inventory-adjustment.component';
import { DetailSalesOrderComponent } from './views/feature/sales/sales-order/detail-sales-order/detail-sales-order.component';
import { DetailSalesQuotationComponent } from './views/feature/sales/sales-quotation/detail-sales-quotation/detail-sales-quotation.component';
import { DetailInvoiceOrderComponent } from './views/feature/sales/sales-order/detail-invoice-order/detail-invoice-order.component';
import { DetailDeliveryOrderComponent } from './views/feature/sales/delivery-order/detail-delivery-order/detail-delivery-order.component';
import { CashBankComponent } from './views/feature/cash-bank/cash-bank.component';
import { ReportComponent } from './views/feature/report/report.component';
import { LedgerComponent } from './views/feature/ledger/ledger.component';
import { ReturOrderComponent } from './views/feature/sales/retur-order/retur-order.component';
import { FormReturOrderComponent } from './views/feature/sales/retur-order/form-retur-order/form-retur-order.component';
import { DetailReturOrderComponent } from './views/feature/sales/retur-order/detail-retur-order/detail-retur-order.component';
import { DetailInventoryAdjustmentComponent } from './views/feature/inventory/inventory-adjustment/detail-inventory-adjustment/detail-inventory-adjustment.component';
import { PlanOpnameComponent } from './views/feature/inventory/plan-opname/plan-opname.component';
import { PlanCreateOpnameComponent } from './views/feature/inventory/plan-opname/plan-create-opname/plan-create-opname.component';
import { ResultOpnameComponent } from './views/feature/inventory/result-opname/result-opname.component';
import { FormProductInventoryComponent } from './views/feature/inventory/product/form-product-inventory/form-product-inventory.component';
import { FormOpnameComponent } from './views/feature/inventory/result-opname/form-opname/form-opname.component';
import { CancelOrderComponent } from './views/feature/sales/cancel-order/cancel-order.component';
import { PlanDetailOpnameComponent } from './views/feature/inventory/plan-opname/plan-detail-opname/plan-detail-opname.component';
import { PlanEditOpnameComponent } from './views/feature/inventory/plan-opname/plan-edit-opname/plan-edit-opname.component';
import { ReceiptGoodsComponent } from './views/feature/sales/receipt-goods/receipt-goods.component';
import { FormReceiptGoodsComponent } from './views/feature/sales/receipt-goods/form-receipt-goods/form-receipt-goods.component';
import { ReturnGoodsDeliveryComponent } from './views/feature/sales/return-goods-delivery/return-goods-delivery.component';
import { FormReturnGoodsDeliveryComponent } from './views/feature/sales/return-goods-delivery/form-return-goods-delivery/form-return-goods-delivery.component';
import { DetailReceiptGoodsComponent } from './views/feature/sales/receipt-goods/detail-receipt-goods/detail-receipt-goods.component';
import { DetailReturnGoodsDeliveryComponent } from './views/feature/sales/return-goods-delivery/detail-return-goods-delivery/detail-return-goods-delivery.component';
import { FormCustomerComponent } from './views/feature/master/contact/form-customer/form-customer.component';
import { FormSupplierComponent } from './views/feature/master/contact/form-supplier/form-supplier.component';
import { FormSalesComponent } from './views/feature/master/contact/form-sales/form-sales.component';


import { ContentSettingComponent } from './views/feature/content-setting/content-setting.component';
import { LogoSettingComponent } from './views/feature/content-setting/logo-setting/logo-setting.component';
import { BenefitSettingComponent } from './views/feature/content-setting/benefit-setting/benefit-setting.component';
import { BannerSettingComponent } from './views/feature/content-setting/banner-setting/banner-setting.component';
import { TestimonialSettingComponent } from './views/feature/content-setting/testimonial-setting/testimonial-setting.component';
import { ProductSpecialComponent } from './views/feature/content-setting/product-special/product-special.component';
import { SubscriptionComponent } from './views/feature/content-setting/subscription/subscription.component';
import { PromoSettingComponent } from './views/feature/content-setting/promo-setting/promo-setting.component';
import { DiscountSettingComponent } from './views/feature/content-setting/discount-setting/discount-setting.component';

import { PaymentSettingComponent } from './views/feature/content-setting/footer/payment/payment.component';
import { CourierSettingComponent } from './views/feature/content-setting/footer/courier/courier.component';

import { AllDiscountComponent } from './views/feature/content-setting/discount-setting/discount-type/all/all-discount.component';
import { ActiveDiscountComponent } from './views/feature/content-setting/discount-setting/discount-type/active/active-discount.component';
import { NextDiscountComponent } from './views/feature/content-setting/discount-setting/discount-type/next/next-discount.component';
import { PassedDiscountComponent } from './views/feature/content-setting/discount-setting/discount-type/passed/passed-discount.component';

import { AddDiscountComponent } from './views/feature/content-setting/discount-setting/add-discount/add-discount.component';
import { UpdateDiscountComponent } from './views/feature/content-setting/discount-setting/update-discount/update-discount.component';
import { DetailDiscountComponent } from './views/feature/content-setting/discount-setting/detail-discount/detail-discount.component';

import { DetailResultOpnameComponent } from './views/feature/inventory/result-opname/detail-result-opname/detail-result-opname.component';
import { HelperComponent } from './views/feature/content-setting/footer/customer-service/helper.component';
import { ReturnComponent } from './views/feature/content-setting/footer/customer-service/return.component';
import { OrderStatusComponent } from './views/feature/content-setting/footer/customer-service/order-status.component';
import { PaymentComponent } from './views/feature/content-setting/footer/customer-service/payment.component';
import { WarrantyComponent } from './views/feature/content-setting/footer/customer-service/warranty.component';
import { ContactUsComponent } from './views/feature/content-setting/footer/customer-service/contact-us.component';

import { AboutUsComponent } from './views/feature/content-setting/footer/about-us/about-us.component';
import { PrivacyPolicyComponent } from './views/feature/content-setting/footer/about-us/privacy-policy.component';
import { SecurePaymentComponent } from './views/feature/content-setting/footer/about-us/secure-payment.component';
import { TermsComponent } from './views/feature/content-setting/footer/about-us/terms.component';
import { ReviewRatingComponent } from './views/feature/content-setting/review-rating/review-rating.component';
import { BillOfMaterialComponent } from './views/feature/inventory/bill-of-material/bill-of-material.component';
import { FormBomComponent } from './views/feature/inventory/bill-of-material/form-bom/form-bom.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: MainLayoutComponent, canActivate: [AuthLoginGuard],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthLoginGuard] },
      /*URL MODULE Inventory*/
      {
        path: 'dashboard-inventory',
        children: [
          { path: 'dashboard-inventory', redirectTo: '' },
          { path: '', component: InventoryComponent, canActivate: [AuthLoginGuard], data: { title: 'Data Store' } },
          {
            path: 'product-data',
            children: [
              { path: 'product-data', redirectTo: '' },
              { path: '', component: ProductComponent, canActivate: [AuthLoginGuard], data: { title: 'Master Product' } },
              // { path: 'create-product', component: FormProductComponent, canActivate: [AuthLoginGuard], data: { title: 'Tambah Product' } },
              // { path: 'update-product/:id', component: FormProductComponent, canActivate: [AuthLoginGuard], data: { title: 'Update Product' } },
              { path: 'create-product', component: FormProductInventoryComponent, canActivate: [AuthLoginGuard], data: { title: 'form Product'} },
              { path: 'update-product/:id', component: FormProductInventoryComponent, canActivate: [AuthLoginGuard], data: { title: 'form Product'} },
            ]
          },
          {
            path: 'bill-of-material',
            children: [
              { path: 'bill-of-material', redirectTo: '' },
              { path: '', component: BillOfMaterialComponent, canActivate: [AuthLoginGuard], data: { title: 'Bill Of Material' } },
              { path: 'create', component: FormBomComponent, canActivate: [AuthLoginGuard], data: { title: 'Tambah Bill Of Material' } },
              { path: 'update/:id', component: FormBomComponent, canActivate: [AuthLoginGuard], data: { title: 'Update Bill Of Material' } },
            ]
          },
          {
            path: 'logistics-data',
            children: [
              { path: 'logistics-data', redirectTo: '' },
              { path: '', component: LogisticsComponent, canActivate: [AuthLoginGuard], data: { title: 'Logistics' } },
              { path: 'create-logistics', component: FormLogisticsComponent, canActivate: [AuthLoginGuard], data: { title: 'Create Logistics' } },
              { path: 'update-logistics/:id', component: FormLogisticsComponent, canActivate: [AuthLoginGuard], data: { title: 'Update Logistics' } },
            ]
          },
          { path: 'inventory-summary', component: InventorySummaryComponent, canActivate: [AuthLoginGuard], data: { title: 'inventory-summary' } },
          {
            path: 'inventory-adjustment',
            children: [
              { path: 'inventory-adjustment', redirectTo: '' },
              { path: '', component: InventoryAdjustmentComponent, canActivate: [AuthLoginGuard], data: { title: 'inventory-adjustment' } },
              { path: 'create-inventory-adjustment', component: FormInventoryAdjustmentComponent, data: { title: 'Add Inventory Adjustment' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-inventory-adjustment/:id', component: DetailInventoryAdjustmentComponent, data: { title: 'Detail Inventory Adjustment' }, canActivate: [AuthLoginGuard] },
            ],
          },
          {
            path: 'plan-stock-opname',
            children: [
              { path: 'plan-stock-opname', redirectTo: '' },
              { path: '', component: PlanOpnameComponent, canActivate: [AuthLoginGuard], data: { title: 'plan-stock-opname' } },
              { path: 'create-opname-plan', component: PlanCreateOpnameComponent, data: { title: 'Add Opname Plan' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-opname-plan/:id', component: PlanDetailOpnameComponent, data: { title: 'Detail Opname Plan' }, canActivate: [AuthLoginGuard] },
              { path: 'edit-opname-plan/:id', component: PlanEditOpnameComponent, data: { title: 'Edit Opname Plan' }, canActivate: [AuthLoginGuard] },
            ]
          },
          {
            path: 'result-stock-opname',
            children: [
              { path: 'result-stock-opname', redirectTo: '' },
              { path: '', component: ResultOpnameComponent, canActivate: [AuthLoginGuard], data: { title: 'result-stock-opname' } },
              { path: 'create-opname', component: FormOpnameComponent, data: { title: 'Add Opname' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-opname-result/:id', component: DetailResultOpnameComponent, data: { title: 'Detail Plan Opname' }, canActivate: [AuthLoginGuard] },
            ]
          },
        ]
      },

      /*URL MODULE SALES */
      {
        path: 'dashboard-sales',
        children: [
          { path: 'dashboard-sales', redirectTo: '' },
          { path: '', component: SalesComponent, data: { title: 'Penjualan' }, canActivate: [AuthLoginGuard] },
          {
            path: 'sales-order',
            children: [
              { path: 'sales-order', redirectTo: '' },
              { path: '', component: SalesOrderComponent, data: { title: 'Penjualan' }, canActivate: [AuthLoginGuard] },
              { path: 'create-order', component: FormOrderComponent, data: { title: 'Form Penjualan' }, canActivate: [AuthLoginGuard] },
              { path: 'update-order/:id', component: FormOrderComponent, data: { title: 'Form Penjualan' }, canActivate: [AuthLoginGuard] },
              { path: 'create-order/preview', component: FormOrderComponent, data: { title: 'Form Preview Penjualan' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-order/:id', component: DetailSalesOrderComponent, data: { title: 'Detail Penjualan' }, canActivate: [AuthLoginGuard] },
              { path: 'invoice-order/:id', component: DetailInvoiceOrderComponent, data: { title: 'Detail Invoice Penjualan' }, canActivate: [AuthLoginGuard] },
            ]
          },
          {
            path: 'sales-quotation',
            children: [
              { path: 'sales-quotation', redirectTo: '' },
              { path: '', component: SalesQuotationComponent, data: { title: 'Penawaran Harga', breadcrumbs: [SalesQuotationComponent] }, canActivate: [AuthLoginGuard] },
              { path: 'create-quotation', component: FormQuotationComponent, data: { title: 'Form Sales Quotation' }, canActivate: [AuthLoginGuard] },
              { path: 'update-quotation/:id', component: FormQuotationComponent, data: { title: 'Form Sales Quotation' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-quotation/:id', component: DetailSalesQuotationComponent, data: { title: 'Detail Sales Order' }, canActivate: [AuthLoginGuard] },
              { path: 'invoice-quotation', component: DetailSalesQuotationComponent, data: { title: 'Detail Sales Order' }, canActivate: [AuthLoginGuard] },
            ]
          },
          {
            path: 'delivery-order',
            children: [
              { path: 'delivery-order', redirectTo: '' },
              { path: '', component: DeliveryOrderComponent, data: { title: 'Pengiriman Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'create-delivery', component: FormDeliveryComponent, data: { title: 'Form Pengiriman Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'update-delivery/:id', component: FormDeliveryComponent, data: { title: 'Form Pengiriman Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-delivery/:id', component: DetailDeliveryOrderComponent, data: { title: 'Detail Pengiriman Barang' }, canActivate: [AuthLoginGuard] },
            ]
          },
          {
            path: 'retur-order',
            children: [
              { path: 'retur-order', redirectTo: '' },
              { path: '', component: ReturOrderComponent, data: { title: 'Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'create-retur', component: FormReturOrderComponent, data: { title: 'Form Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'update-retur/:id', component: FormReturOrderComponent, data: { title: 'Form Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-retur/:id', component: DetailReturOrderComponent, data: { title: 'Detail Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
            ]
          },
          { path: 'cancel-order', component: CancelOrderComponent, data: { title: 'Pembatalan Pesanan' }, canActivate: [AuthLoginGuard], },
          {
            path: 'return-receipt-order',
            children: [
              { path: 'return-receipt-order', redirectTo: '' },
              { path: '', component: ReceiptGoodsComponent, data: { title: 'Penerimaan Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'update-return-receipt/:id', component: FormReceiptGoodsComponent, data: { title: 'Form Penerimaan Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-return-receipt/:id', component: DetailReceiptGoodsComponent, data: { title: 'Detail Penerimaan Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
            ]
          },
          {
            path: 'return-goods-delivery',
            children: [
              { path: 'return-goods-delivery', redirectTo: '' },
              { path: '', component: ReturnGoodsDeliveryComponent, data: { title: 'Pengiriman Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'create-return-goods-delivery', component: FormReturnGoodsDeliveryComponent, data: { title: 'Form Pengiriman Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'update-return-goods-delivery/:id', component: FormReturnGoodsDeliveryComponent, data: { title: 'Form Pengiriman Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
              { path: 'detail-return-goods-delivery/:id', component: DetailReturnGoodsDeliveryComponent, data: { title: 'Detail Pengiriman Pengembalian Barang' }, canActivate: [AuthLoginGuard] },
            ]
          },
        ]
      },

      /*URL MODULE MASTER */
      {
        path: 'dashboard-master', data: { title: 'Data Master' },
        children: [
          { path: 'dashboard-master', data: { title: 'Data Master' }, redirectTo: '' },
          { path: '', component: MasterComponent, data: { title: 'Data Master' }, canActivate: [AuthLoginGuard] },
          {
            path: 'contact', component: ContactComponent, data: { title: 'Data Master' }, canActivate: [AuthLoginGuard],
            children: [
              { path: 'customer', component: FormCustomerComponent, data: { title: 'Data Kontak' }, canActivate: [AuthLoginGuard] },
              { path: 'supplier', component: FormSupplierComponent, data: { title: 'Data Kontak' }, canActivate: [AuthLoginGuard] },
              { path: 'sales', component: FormSalesComponent, data: { title: 'Data Kontak' }, canActivate: [AuthLoginGuard] },
            ]
          },
          { path: 'warehouse-data', component: WarehouseComponent, data: { title: 'Data Gudang' }, canActivate: [AuthLoginGuard], },
          { path: 'brand-data', component: BrandComponent, data: { title: 'Data Brand' }, canActivate: [AuthLoginGuard], },
          { path: 'category-data', component: CategoryProdukComponent, canActivate: [AuthLoginGuard], data: { title: 'Data Kategori' }, },
        ]
      },

      /*URL MODULE PURCHASE */
      { path: 'dashboard-purchase', component: PurchaseComponent, canActivate: [AuthLoginGuard], data: { title: 'Menu Pembelian' }, },

      /*URL MODULE CASH AND BANK */
      { path: 'dashboard-cash-bank', component: CashBankComponent, canActivate: [AuthLoginGuard], data: { title: 'Menu Kas dan Bank' }, },
      /*URL MODULE REPORT */
      {
        path: 'dashboard-report',
        children: [
          { path: 'dashboard-report', redirectTo: '' },
          { path: '', component: ReportComponent, canActivate: [AuthLoginGuard], data: { title: 'Menu Laporan' } },
        ]
      },
      /*URL MODULE REPORT */
      {
        path: 'dashboard-ledger',
        children: [
          { path: 'dashboard-ledger', redirectTo: '' },
          { path: '', component: LedgerComponent, canActivate: [AuthLoginGuard], data: { title: 'Menu Buku Besar' } },
        ]
      },

      /*URL MODULE CONTENT SETTING*/
      {
        path: 'dashboard-content-setting', data: { title: '' },
        children: [
          { path: 'dashboard-content-setting', redirectTo: '' },
          {
            path: '', component: ContentSettingComponent, data: { title: 'Content Setting' }, canActivate: [AuthLoginGuard],
            children: [
              {path: 'logo-setting', component: LogoSettingComponent, data: { title: 'Logo Setting'}, canActivate: [AuthLoginGuard]},
              {path: 'benefit-setting', component: BenefitSettingComponent, data: { title: 'Benefit Setting'}, canActivate: [AuthLoginGuard]},
              {path: 'banner-setting', component: BannerSettingComponent, data: { title: 'Banner Setting'}, canActivate: [AuthLoginGuard]},
              {path: 'testimonial-setting', component: TestimonialSettingComponent, data: { title: 'Testimonial Setting'}, canActivate: [AuthLoginGuard]},
              {path: 'product-special', component: ProductSpecialComponent, data: { title: 'Product Special Setting'}, canActivate: [AuthLoginGuard]},
              {path: 'subscription', component: SubscriptionComponent, data: { title: 'Subscription'}, canActivate: [AuthLoginGuard]},
              {path: 'promo-setting', component: PromoSettingComponent, data: { title: 'Promo Setting'}, canActivate: [AuthLoginGuard]},
              {path: 'payment-option-setting', component: PaymentSettingComponent, data: { title: 'Payment Option Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'courier-option-setting', component: CourierSettingComponent, data: { title: 'Courier Option Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'helper-setting', component: HelperComponent, data: { title: 'Helper Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'return-setting', component: ReturnComponent, data: { title: 'Return Product Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'order-status-setting', component: OrderStatusComponent, data: { title: 'Order Status Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'payment-setting', component: PaymentComponent, data: { title: 'Payment Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'warranty-setting', component: WarrantyComponent, data: { title: 'Warranty Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'contact-us-setting', component: ContactUsComponent, data: { title: 'Contact Us Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'about-us-setting', component: AboutUsComponent, data: { title: 'About Us Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'privacy-policy-setting', component: PrivacyPolicyComponent, data: { title: 'Privacy Policy Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'secure-payment-setting', component: SecurePaymentComponent, data: { title: 'Secure Paymnet Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'terms-setting', component: TermsComponent, data: { title: 'Terms and Condition Setting'}, canActivate: [AuthLoginGuard] },
              {path: 'review-rating', component: ReviewRatingComponent, data: { title: 'Review & Rating'}, canActivate: [AuthLoginGuard] },
              {
                path: 'discount-setting', data: { title: '' },
                children: [
                  { path: 'discount-setting', redirectTo: '' },
                  {path: '', component: DiscountSettingComponent, data: { title: 'Discount Setting'}, canActivate: [AuthLoginGuard],
                  children: [
                    { path: '', component: AllDiscountComponent, data: { title: 'All Discount' }, canActivate: [AuthLoginGuard] },
                    { path: 'all-discount', component: AllDiscountComponent, data: { title: 'All Discount' }, canActivate: [AuthLoginGuard] },
                    { path: 'active-discount', component: ActiveDiscountComponent, data: { title: 'Active Discount' }, canActivate: [AuthLoginGuard] },
                    { path: 'next-discount', component: NextDiscountComponent, data: { title: 'On Going Discount' }, canActivate: [AuthLoginGuard] },
                    { path: 'passed-discount', component: PassedDiscountComponent, data: { title: 'Passed Discount' }, canActivate: [AuthLoginGuard] },
                  ]
                },
                ]
              },
            ]
          },
        ]
      },

      /*URL MODULE CONTENT SETTING DISCOUNT FORM*/
      {
        path: 'manage-discount',
        children: [
          { path: 'new-discount', component: AddDiscountComponent, data: { title: 'New Discount' }, canActivate: [AuthLoginGuard] },
          { path: 'update-discount/:id', component: UpdateDiscountComponent, data: { title: 'Update Discount' }, canActivate: [AuthLoginGuard] },
          { path: 'detail-discount/:id', component: DetailDiscountComponent, data: { title: 'Detail Discount' }, canActivate: [AuthLoginGuard] },
        ]
      },
      
    ]
  },
  /*ROUTING TUTORIAL ANGULAR */
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
