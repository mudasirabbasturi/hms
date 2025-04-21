<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;
/**
 * User, Department, Patient, Template, Appointment
 */
use App\Http\Controllers\UserController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\AppointmentController;

/**
 * Inventory 
 */
use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemStockController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ItemSupplierController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\StockConsumptionController;
use App\Http\Controllers\StockRequestController;
use App\Http\Controllers\PurchaseRequisitionController;
use App\Http\Controllers\PurchaseOrderController;

/**
 * Medical Records
 */
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\VitalController;

/**
 * Invoice, Shift, Category
 */
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TimingController;

Route::get('/', function () {
    return inertia('Components/Home');
});

// Users
Route::get('/users/{type}', [UserController::class, 'Index'])->name('user.index');
Route::post('/user/store', [UserController::class, 'Store'])->name('user.store');
Route::get('/user/{id}', [UserController::class, 'Show'])->name('user.show');
Route::put('/user/{id}', [UserController::class, 'updateSingleColumn'])->name('user.update.single-column');
Route::put('/user/update/profile/{id}', [UserController::class, 'updateProfile'])->name('user.update.profile');
Route::delete('/user/{id}', [UserController::class, 'Destroy'])->name('user.destroy');

/** Departments Route Start */
Route::get('/departments', [DepartmentController::class, 'Index'])->name('department.index');
Route::post('/department/store', [DepartmentController::class, 'Store'])->name('department.store');
Route::get('/department/{id}', [DepartmentController::class, 'Edit'])->name('department.edit');
Route::put('/department/{id}', [DepartmentController::class, 'Update'])->name('department.update');
Route::delete('/department/{id}', [DepartmentController::class, 'Destroy'])->name('department.destroy');
/** Departments Route End */

// Patients
Route::get('/patients', [PatientController::class, 'Index'])->name('patients.index');
Route::post('/patient/store', [PatientController::class, 'Store'])->name('patient.store');
Route::get('/patient/view/{id}', [PatientController::class, 'View'])->name('patient.view');
Route::put('/patient/upate/column/{id}', [PatientController::class, 'updateSingleColumn'])->name('patient.update.single-column');
Route::delete('/patient/destroy/{id}', [PatientController::class, 'Destroy'])->name('patient.destroy');

// Template 
Route::get('/templates', [TemplateController::class, 'Index'])->name('templates.index');
Route::post('/template/store', [TemplateController::class, 'Store'])->name('template.store');
Route::put('/template/update/{id}', [TemplateController::class, 'Update'])->name('template.update');
Route::delete('/template/{id}', [TemplateController::class, 'Destroy'])->name('template.destroy');


/**
 *  OPD Token ( Appointment )
 */
Route::get('/opd/token', [AppointmentController::class, 'TokenIndex'])->name('token.index');
Route::post('/opd/token/store', [AppointmentController::class, 'TokenStore'])->name('token.store');

Route::put('/opd/token/update/{id}', 
          [AppointmentController::class, 'TokenUpdate'])
          ->name('token.update');

Route::delete('/opd/token_consultation/destroy/{id}', 
             [AppointmentController::class, 'Destroy'])
             ->name('token_consultation.destroy');

Route::get('/appointments/by-patient/{id}', [AppointmentController::class, 'getByPatient']);

/**
 * Inventory
 */
// ManufacturerController
Route::get('/manufacturers', [ManufacturerController::class, 'Index'])->name('manufacturers.index');
Route::post('/manufacturer/store', [ManufacturerController::class, 'Store'])->name('manufacturer.store');
Route::put('/manufacturer/update/{id}', [ManufacturerController::class, 'Update'])->name('manufacturer.update');
Route::delete('/manufacturer/destroy/{id}', [ManufacturerController::class, 'Destroy'])->name('manufacturer.destroy');

// ItemController
Route::get('/items', [ItemController::class, 'Index'])->name('items.index');
Route::post('/item/store', [ItemController::class, 'Store'])->name('item.store');
Route::put('/item/update/{id}', [ItemController::class, 'Update'])->name('item.update');
Route::delete('/item/destroy/{id}', [ItemController::class, 'Destroy'])->name('item.destroy');

// ItemStockController
Route::get('/item-stocks', [ItemStockController::class, 'Index'])->name('item-stocks.index');
Route::post('/item-stock/store', [ItemStockController::class, 'Store'])->name('item-stock.store');
Route::put('/item-stock/update/{id}', [ItemStockController::class, 'Update'])->name('item-stock.update');
Route::delete('/item-stock/destroy/{id}', [ItemStockController::class, 'Destroy'])->name('item-stock.destroy');

// SupplierController
Route::get('/suppliers', [SupplierController::class, 'Index'])->name('suppliers.index');
Route::post('/supplier/store', [SupplierController::class, 'Store'])->name('supplier.store');
Route::put('/supplier/update/{id}', [SupplierController::class, 'Update'])->name('supplier.update');
Route::delete('/supplier/destroy/{id}', [SupplierController::class, 'Destroy'])->name('supplier.destroy');

// ItemSupplierController
Route::get('/item-suppliers', [ItemSupplierController::class, 'Index'])->name('item-suppliers.index');
Route::post('/item-supplier/store', [ItemSupplierController::class, 'Store'])->name('item-supplier.store');
Route::put('/item-supplier/update/{id}', [ItemSupplierController::class, 'Update'])->name('item-supplier.update');
Route::delete('/item-supplier/destroy/{id}', [ItemSupplierController::class, 'Destroy'])->name('item-supplier.destroy');

// StockAdjustmentController
Route::get('/stock-adjustments', [StockAdjustmentController::class, 'Index'])->name('stock-adjustments.index');
Route::post('/stock-adjustment/store', [StockAdjustmentController::class, 'Store'])->name('stock-adjustment.store');
Route::put('/stock-adjustment/update/{id}', [StockAdjustmentController::class, 'Update'])->name('stock-adjustment.update');
Route::delete('/stock-adjustment/destroy/{id}', [StockAdjustmentController::class, 'Destroy'])->name('stock-adjustment.destroy');

// StockConsumptionController
Route::get('/stock-consumptions', [StockConsumptionController::class, 'Index'])->name('stock-consumptions.index');
Route::post('/stock-consumption/store', [StockConsumptionController::class, 'Store'])->name('stock-consumption.store');
Route::put('/stock-consumption/update/{id}', [StockConsumptionController::class, 'Update'])->name('stock-consumption.update');
Route::delete('/stock-consumption/destroy/{id}', [StockConsumptionController::class, 'Destroy'])->name('stock-consumption.destroy');

// StockRequestController
Route::get('/stock-requests', [StockRequestController::class, 'Index'])->name('stock-requests.index');
Route::post('/stock-request/store', [StockRequestController::class, 'Store'])->name('stock-request.store');
Route::put('/stock-request/update/{id}', [StockRequestController::class, 'Update'])->name('stock-request.update');
Route::delete('/stock-request/destroy/{id}', [StockRequestController::class, 'Destroy'])->name('stock-request.destroy');

// PurchaseRequisitionController
Route::get('/purchase-requisitions', [PurchaseRequisitionController::class, 'Index'])->name('purchase-requisitions.index');
Route::post('/purchase-requisition/store', [PurchaseRequisitionController::class, 'Store'])->name('purchase-requisition.store');
Route::put('/purchase-requisition/update/{id}', [PurchaseRequisitionController::class, 'Update'])->name('purchase-requisition.update');
Route::delete('/purchase-requisition/destroy/{id}', [PurchaseRequisitionController::class, 'Destroy'])->name('purchase-requisition.destroy');

// PurchaseOrderController
Route::get('/purchase-orders', [PurchaseOrderController::class, 'Index'])->name('purchase-orders.index');
Route::post('/purchase-order/store', [PurchaseOrderController::class, 'Store'])->name('purchase-order.store');
Route::put('/purchase-order/update/{id}', [PurchaseOrderController::class, 'Update'])->name('purchase-order.update');
Route::delete('/purchase-order/destroy/{id}', [PurchaseOrderController::class, 'Destroy'])->name('purchase-order.destroy');

/**
 * MedicalRecordController
 */

Route::get('/medical-records', [MedicalRecordController::class, 'Index'])->name('medical-records.index');
Route::post('/medical-record/store', [MedicalRecordController::class, 'Store'])->name('medical-record.store');
Route::put('/medical-record/update/{id}', [MedicalRecordController::class, 'Update'])->name('medical-record.update');
Route::delete('/medical-record/destroy/{id}', [MedicalRecordController::class, 'Destroy'])->name('medical-record.destroy');

/**
 * MedicationController
 */
 Route::get('/medications', [MedicationController::class, 'Index'])->name('medications.index');
 Route::post('/medication/store', [MedicationController::class, 'Store'])->name('medication.store');
 Route::put('/medication/update/{id}', [MedicationController::class, 'Update'])->name('medication.update');
 Route::delete('/medication/destroy/{id}', [MedicationController::class, 'Destroy'])->name('medication.destroy');

 /**
 * VitalController
 */
 Route::get('/vitals', [VitalController::class, 'Index'])->name('vitals.index');
 Route::post('/vital/store', [VitalController::class, 'Store'])->name('vital.store');
 Route::put('/vital/update/{id}', [VitalController::class, 'Update'])->name('vital.update');
 Route::delete('/vital/destroy/{id}', [VitalController::class, 'Destroy'])->name('vital.destroy');

 /**
 * InvoiceController
 */
 Route::get('/invoices', [InvoiceController::class, 'Index'])->name('invoices.index');
 Route::post('/invoice/store', [InvoiceController::class, 'Store'])->name('invoice.store');
 Route::put('/invoice/update/{id}', [InvoiceController::class, 'Update'])->name('invoice.update');
 Route::delete('/invoice/destroy/{id}', [InvoiceController::class, 'Destroy'])->name('invoice.destroy');

 /**
 * ShiftController
 */
 Route::get('/shifts', [ShiftController::class, 'Index'])->name('shifts.index');
 Route::post('/shift/store', [ShiftController::class, 'Store'])->name('shift.store');
 Route::put('/shift/update/{id}', [ShiftController::class, 'Update'])->name('shift.update');
 Route::delete('/shift/destroy/{id}', [ShiftController::class, 'Destroy'])->name('shift.destroy');

 /**
 * CategoryController
 */
 Route::get('/categories', [CategoryController::class, 'Index'])->name('categories.index');
 Route::post('/category/store', [CategoryController::class, 'Store'])->name('category.store');
 Route::put('/category/update/{id}', [CategoryController::class, 'Update'])->name('category.update');
 Route::delete('/category/destroy/{id}', [CategoryController::class, 'Destroy'])->name('category.destroy');

 /**
 * TimingController
 */
Route::get('/timings', [TimingController::class, 'Index'])->name('timings.index');
Route::post('/timing/store', [TimingController::class, 'Store'])->name('timing.store');
Route::put('/timing/update/{id}', [TimingController::class, 'Update'])->name('timing.update');
Route::delete('/timing/destroy/{id}', [TimingController::class, 'Destroy'])->name('timing.destroy');
