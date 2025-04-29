Schema::create('manufacturers', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('address')->nullable();
    $table->string('contact_email')->nullable();
    $table->string('contact_phone')->nullable();
    $table->string('website')->nullable();
    $table->string('country')->nullable();
    $table->string('license_number')->nullable();
    $table->text('notes')->nullable();
    $table->boolean('is_active')->default(true);
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
    $table->string('name');
    $table->string('code')->nullable()->unique();
    $table->text('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('items', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('generic_name')->nullable();
    $table->string('barcode')->nullable()->unique();
    $table->string('sku')->nullable()->unique();
    $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
    $table->foreignId('manufacturer_id')->nullable()->constrained('manufacturers')->nullOnDelete();
    $table->string('unit');
    $table->string('pack_size')->nullable();
    $table->integer('reorder_level')->default(0);
    $table->integer('optimal_stock_level')->nullable();
    $table->enum('storage_condition', ['room_temp', 'refrigerated', 'frozen'])->default('room_temp');
    $table->boolean('requires_prescription')->default(false);
    $table->boolean('is_active')->default(true);
    $table->text('description')->nullable();
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('item_prices', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->decimal('purchase_price', 10, 2);
    $table->decimal('selling_price', 10, 2);
    $table->decimal('wholesale_price', 10, 2)->nullable();
    $table->decimal('discount', 5, 2)->default(0);
    $table->decimal('tax_rate', 5, 2)->default(0);
    $table->date('effective_from');
    $table->date('effective_to')->nullable();
    $table->boolean('is_current')->default(true);
    $table->timestamps();
});

Schema::create('item_stocks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->string('batch_no')->nullable();
    $table->date('manufacturing_date')->nullable();
    $table->date('expiry_date')->nullable();
    $table->integer('initial_qty');
    $table->integer('available_qty');
    $table->decimal('unit_cost', 10, 2);
    $table->decimal('total_cost', 10, 2);
    $table->decimal('retail_price', 10, 2);
    $table->decimal('net_retail_price', 10, 2)->nullable();
    $table->decimal('discount', 10, 2)->default(0);
    $table->decimal('sales_tax', 10, 2)->default(0);
    $table->decimal('net_value', 10, 2);
    $table->enum('stock_status', ['in_stock', 'low_stock', 'out_of_stock', 'expired'])->default('in_stock');
    $table->string('location')->nullable();
    $table->string('shelf')->nullable();
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('suppliers', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->nullable();
    $table->string('phone')->nullable();
    $table->string('address')->nullable();
    $table->string('city')->nullable();
    $table->string('country')->nullable();
    $table->string('tax_id')->nullable();
    $table->string('contact_person')->nullable();
    $table->string('payment_terms')->nullable();
    $table->boolean('is_active')->default(true);
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('item_suppliers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
    $table->decimal('supplier_price', 10, 2)->nullable();
    $table->string('supplier_code')->nullable();
    $table->integer('lead_time_days')->nullable();
    $table->boolean('is_primary')->default(false);
    $table->timestamps();
});

Schema::create('departments', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('code')->nullable();
    $table->text('description')->nullable();
    $table->boolean('is_active')->default(true);
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('stock_adjustments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_stock_id')->constrained('item_stocks')->cascadeOnDelete();
    $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
    $table->integer('adjusted_qty');
    $table->decimal('unit_cost', 10, 2);
    $table->decimal('total_cost', 10, 2);
    $table->enum('adjustment_type', ['addition', 'deduction', 'expired', 'damaged', 'theft', 'other']);
    $table->string('reason')->nullable();
    $table->foreignId('adjusted_by')->constrained('users')->cascadeOnDelete();
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('stock_consumptions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_stock_id')->constrained('item_stocks')->cascadeOnDelete(); 
    $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
    $table->foreignId('patient_id')->nullable()->constrained('patients')->nullOnDelete();
    $table->foreignId('prescription_id')->nullable()->constrained('prescriptions')->nullOnDelete();
    $table->integer('consumed_qty');
    $table->enum('consumption_type', ['dispense', 'internal_use', 'ward_stock', 'emergency', 'other']);
    $table->string('reference_number')->nullable();
    $table->string('template_name')->nullable();
    $table->foreignId('consumed_by')->constrained('users')->cascadeOnDelete();
    $table->text('comment')->nullable();
    $table->decimal('total_cost', 10, 2)->default(0);
    $table->decimal('total_retail_price', 10, 2)->default(0);
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('stock_requests', function (Blueprint $table) {
    $table->id();
    $table->string('request_number')->unique();
    $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
    $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
    $table->foreignId('item_id')->constrained()->nullOnDelete();
    $table->integer('requested_qty');
    $table->integer('approved_qty')->nullable();
    $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
    $table->dateTime('approved_at')->nullable();
    $table->enum('status', ['pending', 'approved', 'partially_approved', 'rejected', 'completed', 'returned'])->default('pending');
    $table->text('rejection_reason')->nullable();
    $table->text('notes')->nullable();
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('purchase_requisitions', function (Blueprint $table) {
    $table->id();
    $table->string('requisition_number')->unique();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
    $table->integer('requested_qty');
    $table->integer('approved_qty')->nullable();
    $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
    $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
    $table->dateTime('approved_at')->nullable();
    $table->enum('status', ['pending', 'approved', 'rejected', 'ordered'])->default('pending');
    $table->decimal('estimated_cost', 10, 2)->nullable();
    $table->decimal('approved_cost', 10, 2)->nullable();
    $table->text('notes')->nullable();
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('purchase_orders', function (Blueprint $table) {
    $table->id();
    $table->string('po_number')->unique();
    $table->foreignId('purchase_requisition_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
    $table->date('order_date');
    $table->date('expected_delivery_date')->nullable();
    $table->decimal('subtotal', 12, 2);
    $table->decimal('tax', 12, 2)->default(0);
    $table->decimal('discount', 12, 2)->default(0);
    $table->decimal('shipping_cost', 12, 2)->default(0);
    $table->decimal('total_amount', 12, 2);
    $table->enum('status', ['draft', 'pending', 'approved', 'partially_received', 'completed', 'cancelled'])->default('draft');
    $table->text('terms')->nullable();
    $table->text('notes')->nullable();
    $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
    $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('purchase_order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->integer('quantity');
    $table->decimal('unit_price', 10, 2);
    $table->decimal('tax_rate', 5, 2)->default(0);
    $table->decimal('discount', 5, 2)->default(0);
    $table->decimal('total_price', 10, 2);
    $table->integer('received_quantity')->default(0);
    $table->timestamps();
});

Schema::create('goods_receipts', function (Blueprint $table) {
    $table->id();
    $table->string('grn_number')->unique();
    $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
    $table->date('receipt_date');
    $table->foreignId('received_by')->constrained('users')->cascadeOnDelete();
    $table->text('notes')->nullable();
    $table->enum('status', ['partial', 'complete'])->default('complete');
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('goods_receipt_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('goods_receipt_id')->constrained()->cascadeOnDelete();
    $table->foreignId('purchase_order_item_id')->constrained('purchase_order_items')->cascadeOnDelete();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->integer('quantity_received');
    $table->string('batch_number')->nullable();
    $table->date('expiry_date')->nullable();
    $table->decimal('unit_price', 10, 2);
    $table->decimal('total_price', 10, 2);
    $table->text('remarks')->nullable();
    $table->timestamps();
});

Schema::create('inventory_transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->foreignId('item_stock_id')->nullable()->constrained('item_stocks')->nullOnDelete();
    $table->enum('transaction_type', ['purchase', 'sale', 'adjustment', 'transfer', 'consumption', 'return']);
    $table->integer('quantity');
    $table->decimal('unit_cost', 10, 2);
    $table->decimal('total_cost', 10, 2);
    $table->string('reference_number')->nullable();
    $table->foreignId('reference_id')->nullable()->comment('ID of the related document (PO, GRN, etc)');
    $table->string('reference_type')->nullable()->comment('Class name of the related document');
    $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
    $table->text('notes')->nullable();
    $table->timestamps();
});

Schema::create('inventory_audits', function (Blueprint $table) {
    $table->id();
    $table->string('audit_number')->unique();
    $table->date('audit_date');
    $table->foreignId('conducted_by')->constrained('users')->cascadeOnDelete();
    $table->text('description')->nullable();
    $table->enum('status', ['planned', 'in_progress', 'completed', 'cancelled'])->default('planned');
    $table->text('findings')->nullable();
    $table->text('recommendations')->nullable();
    $table->softDeletes();
    $table->timestamps();
});

Schema::create('inventory_audit_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('inventory_audit_id')->constrained()->cascadeOnDelete();
    $table->foreignId('item_id')->constrained()->cascadeOnDelete();
    $table->foreignId('item_stock_id')->nullable()->constrained('item_stocks')->nullOnDelete();
    $table->integer('system_quantity');
    $table->integer('physical_quantity');
    $table->integer('variance');
    $table->text('notes')->nullable();
    $table->timestamps();
});
