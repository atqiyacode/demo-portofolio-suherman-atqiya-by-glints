import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MomentModule } from 'ngx-moment';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './views/feature/home/home.component';
import { InventoryComponent } from './views/feature/inventory/inventory.component';
import { PaginationComponent } from './views/library/pagination/pagination.component';
import { CardMenuComponent } from './views/library/card-menu/card-menu.component';
import { CardViewComponent } from './views/library/card-view/card-view.component';
import { ProductComponent } from './views/feature/inventory/product/product.component';
import { FormProductComponent } from './views/feature/inventory/product/form-product/form-product.component';
import { CardHeaderViewComponent } from './views/library/card-header-view/card-header-view.component';
import { LogisticsComponent } from './views/feature/inventory/logistics/logistics.component';
import { FormLogisticsComponent } from './views/feature/inventory/logistics/form-logistics/form-logistics.component';
import { SalesComponent } from './views/feature/sales/sales.component';
import { SalesOrderComponent } from './views/feature/sales/sales-order/sales-order.component';
import { FormOrderComponent } from './views/feature/sales/sales-order/form-order/form-order.component';
import { LoginComponent } from './views/feature/login/login.component';
import { CategoryProdukComponent } from './views/feature/master/category-produk/category-produk.component';
import { ContactComponent } from './views/feature/master/contact/contact.component';
import { MasterComponent } from './views/feature/master/master.component';
import { SalesQuotationComponent } from './views/feature/sales/sales-quotation/sales-quotation.component';
import { FormQuotationComponent } from './views/feature/sales/sales-quotation/form-quotation/form-quotation.component';
import { DeliveryOrderComponent } from './views/feature/sales/delivery-order/delivery-order.component';
import { FormDeliveryComponent } from './views/feature/sales/delivery-order/form-delivery/form-delivery.component';
import { BreadcrumbComponent } from './views/library/breadcrumb/breadcrumb.component';
import { WarehouseComponent } from './views/feature/master/warehouse/warehouse.component';
import { BrandComponent } from './views/feature/master/brand/brand.component';
import { LedgerComponent } from './views/feature/ledger/ledger.component';
import { PurchaseComponent } from './views/feature/purchase/purchase.component';
import { CashBankComponent } from './views/feature/cash-bank/cash-bank.component';
import { ReportComponent } from './views/feature/report/report.component';
import { ContentSettingComponent } from './views/feature/content-setting/content-setting.component';
import { InventorySummaryComponent } from './views/feature/inventory/inventory-summary/inventory-summary.component';
import { InventoryAdjustmentComponent } from './views/feature/inventory/inventory-adjustment/inventory-adjustment.component';
import { FormInventoryAdjustmentComponent } from './views/feature/inventory/inventory-adjustment/form-inventory-adjustment/form-inventory-adjustment.component';
import { DetailSalesOrderComponent } from './views/feature/sales/sales-order/detail-sales-order/detail-sales-order.component';
import { DetailSalesQuotationComponent } from './views/feature/sales/sales-quotation/detail-sales-quotation/detail-sales-quotation.component';
import { DetailInvoiceOrderComponent } from './views/feature/sales/sales-order/detail-invoice-order/detail-invoice-order.component';
import { DetailDeliveryOrderComponent } from './views/feature/sales/delivery-order/detail-delivery-order/detail-delivery-order.component';
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

import { LogoSettingComponent } from './views/feature/content-setting/logo-setting/logo-setting.component';
import { BenefitSettingComponent } from './views/feature/content-setting/benefit-setting/benefit-setting.component';
import { BannerSettingComponent } from './views/feature/content-setting/banner-setting/banner-setting.component';
import { TestimonialSettingComponent } from './views/feature/content-setting/testimonial-setting/testimonial-setting.component';
import { ProductSpecialComponent } from './views/feature/content-setting/product-special/product-special.component';
import { SubscriptionComponent } from './views/feature/content-setting/subscription/subscription.component';

import { PaymentSettingComponent } from './views/feature/content-setting/footer/payment/payment.component';
import { CourierSettingComponent } from './views/feature/content-setting/footer/courier/courier.component';

import { PromoSettingComponent } from './views/feature/content-setting/promo-setting/promo-setting.component';
import { DiscountSettingComponent } from './views/feature/content-setting/discount-setting/discount-setting.component';
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
import { WarrantyComponent } from './views/feature/content-setting/footer/customer-service/warranty.component';
import { ContactUsComponent } from './views/feature/content-setting/footer/customer-service/contact-us.component';
import { PaymentComponent } from './views/feature/content-setting/footer/customer-service/payment.component';
import { AboutUsComponent } from './views/feature/content-setting/footer/about-us/about-us.component';
import { PrivacyPolicyComponent } from './views/feature/content-setting/footer/about-us/privacy-policy.component';
import { SecurePaymentComponent } from './views/feature/content-setting/footer/about-us/secure-payment.component';
import { TermsComponent } from './views/feature/content-setting/footer/about-us/terms.component';
import { ReviewRatingComponent } from './views/feature/content-setting/review-rating/review-rating.component';
import { BillOfMaterialComponent } from './views/feature/inventory/bill-of-material/bill-of-material.component';
import { FormBomComponent } from './views/feature/inventory/bill-of-material/form-bom/form-bom.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  decimal: ',',
  precision: null,
  prefix: '',
  suffix: '',
  thousands: '.'
};
@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    InventoryComponent,
    PaginationComponent,
    CardMenuComponent,
    CardViewComponent,
    ProductComponent,
    FormProductComponent,
    CardHeaderViewComponent,
    LogisticsComponent,
    FormLogisticsComponent,
    SalesComponent,
    SalesOrderComponent,
    FormOrderComponent,
    LoginComponent,
    CategoryProdukComponent,
    ContactComponent,
    MasterComponent,
    SalesQuotationComponent,
    FormQuotationComponent,
    DeliveryOrderComponent,
    FormDeliveryComponent,
    BreadcrumbComponent,
    WarehouseComponent,
    BrandComponent,
    LedgerComponent,
    PurchaseComponent,
    CashBankComponent,
    ReportComponent,
    InventorySummaryComponent,
    InventoryAdjustmentComponent,
    FormInventoryAdjustmentComponent,
    DetailSalesOrderComponent,
    DetailSalesQuotationComponent,
    DetailInvoiceOrderComponent,
    DetailDeliveryOrderComponent,
    ReturOrderComponent,
    FormReturOrderComponent,
    DetailReturOrderComponent,
    UpdateDiscountComponent,
    DetailInventoryAdjustmentComponent,
    PlanOpnameComponent,
    PlanCreateOpnameComponent,
    ResultOpnameComponent,
    FormProductInventoryComponent,
    FormOpnameComponent,
    CancelOrderComponent,
    PlanDetailOpnameComponent,
    PlanEditOpnameComponent,
    ReceiptGoodsComponent,
    FormReceiptGoodsComponent,
    ContentSettingComponent,
    ReturnGoodsDeliveryComponent,
    FormReturnGoodsDeliveryComponent,
    LogoSettingComponent,
    BenefitSettingComponent,
    BannerSettingComponent,
    TestimonialSettingComponent,
    ProductSpecialComponent,
    SubscriptionComponent,
    PromoSettingComponent,
    DiscountSettingComponent,
    AddDiscountComponent,
    DetailDiscountComponent,
    DetailReceiptGoodsComponent,
    DetailReturnGoodsDeliveryComponent,
    DetailResultOpnameComponent,
    FormCustomerComponent,
    FormSupplierComponent,
    FormSalesComponent,
    PaymentSettingComponent,
    CourierSettingComponent,
    HelperComponent,
    ReturnComponent,
    OrderStatusComponent,
    PaymentComponent,
    WarrantyComponent,
    ContactUsComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    SecurePaymentComponent,
    TermsComponent,
    ReviewRatingComponent,
    BillOfMaterialComponent,
    FormBomComponent,
    AllDiscountComponent,
    ActiveDiscountComponent,
    NextDiscountComponent,
    PassedDiscountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbModalModule,
    ToastrModule.forRoot(),
    CurrencyMaskModule,
    NgxDaterangepickerMd.forRoot(),
    MomentModule,
    NgxPaginationModule,

  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
