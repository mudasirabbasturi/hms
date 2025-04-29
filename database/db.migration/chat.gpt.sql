<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

Schema::create('departments', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('description')->nullable();
    $table->timestamps();
});

Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('password');
    $table->enum('role', ['admin', 'pharmacist', 'storekeeper'])->default('pharmacist');
    $table->timestamps();
});

Schema::create('manufacturers', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('address')->nullable();
    $table->string('contact_email')->nullable();
    $table->string('contact_phone')->nullable();
    $table->timestamps();
});

Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
    $table->string('name');
    $table->timestamps();
});

Schema::create('items', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('barcode')->nullable()->unique();
    $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
    $table->foreignId('manufacturer_id')->nullable()->constrained()->nullOnDelete();
    $table->string('unit');
    $table->integer('reorder_level')->default(0);
    $table->timestamps();
});

Schema::create('item_stocks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->string('batch_no')->nullable();
    $table->date('expiry_date')->nullable();
    $table->integer('total_qty');
    $table->decimal('unit_cost', 10, 2);
    $table->decimal('total_cost', 10, 2);
    $table->decimal('retail_price', 10, 2);
    $table->decimal('net_retail_price', 10, 2)->nullable();
    $table->decimal('discount', 10, 2)->default(0);
    $table->decimal('sales_tax', 10, 2)->default(0);
    $table->decimal('net_value', 10, 2);
    $table->timestamps();
});

Schema::create('suppliers', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->nullable();
    $table->string('phone')->nullable();
    $table->string('address')->nullable();
    $table->timestamps();
});

Schema::create('item_suppliers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
});

Schema::create('stock_adjustments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_stock_id')->constrained('item_stocks')->cascadeOnDelete();
    $table->integer('adjusted_qty');
    $table->string('reason')->nullable();
    $table->timestamps();
});

Schema::create('stock_consumptions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_stock_id')->constrained('item_stocks')->cascadeOnDelete();
    $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
    $table->integer('consumed_qty');
    $table->string('consumption_type');
    $table->string('template_name')->nullable();
    $table->string('added_by')->nullable();
    $table->text('comment')->nullable();
    $table->decimal('total_cost', 10, 2)->default(0);
    $table->decimal('total_retail_price', 10, 2)->default(0);
    $table->timestamps();
});

Schema::create('stock_requests', function (Blueprint $table) {
    $table->id();
    $table->string('requested_by');
    $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
    $table->foreignId('item_id')->constrained()->nullOnDelete();
    $table->integer('requested_qty');
    $table->enum('status', ['pending', 'approved', 'rejected', 'returned'])->default('pending');
    $table->timestamps();
});

Schema::create('purchase_requisitions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
    $table->integer('requested_qty');
    $table->text('notes')->nullable();
    $table->timestamps();
});

Schema::create('purchase_orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('purchase_requisition_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
    $table->date('order_date');
    $table->string('status')->default('pending');
    $table->timestamps();
});

Schema::create('sales', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->dateTime('sale_date');
    $table->decimal('total_amount', 10, 2);
    $table->decimal('discount', 10, 2)->default(0);
    $table->decimal('net_amount', 10, 2);
    $table->timestamps();
});

Schema::create('sale_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
    $table->foreignId('item_stock_id')->constrained()->cascadeOnDelete();
    $table->integer('quantity');
    $table->decimal('unit_price', 10, 2);
    $table->decimal('total_price', 10, 2);
    $table->timestamps();
});

Schema::create('returns', function (Blueprint $table) {
    $table->id();
    $table->enum('type', ['purchase', 'sale']);
    $table->foreignId('item_stock_id')->constrained()->cascadeOnDelete();
    $table->foreignId('related_id')->nullable();
    $table->integer('quantity');
    $table->text('reason')->nullable();
    $table->date('return_date');
    $table->timestamps();
});

Schema::create('stock_transfers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_stock_id')->constrained()->cascadeOnDelete();
    $table->foreignId('from_department_id')->nullable()->constrained('departments')->nullOnDelete();
    $table->foreignId('to_department_id')->nullable()->constrained('departments')->nullOnDelete();
    $table->integer('quantity');
    $table->date('transfer_date');
    $table->string('approved_by')->nullable();
    $table->timestamps();
});

Schema::create('storage_locations', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('description')->nullable();
    $table->timestamps();
});

Schema::create('audit_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
    $table->string('action');
    $table->text('details')->nullable();
    $table->timestamps();
});
