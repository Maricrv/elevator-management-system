from django.contrib import admin
from .models import (
    Clients,
    Projects,
    Sales,
    Personnel,
    AreaTypes,
    ProjectAssignmentAreaPersonnel,
    AreaStatus,
    ElevatorModels,
    ProjectStatus,
    Proformas,
    ProjectTypes,
    ElevatorConfigurations,
    Attachments,
    Inventory,
    InventoryTransactions,
    MaintenanceRequests,
    MaintenanceLogs
)


@admin.register(Sales)
class SalesAdmin(admin.ModelAdmin):
    list_display = ('sale_id', 'get_proforma_id', 'client', 'price', 'paid', 'payment_date', 'payment_method')  # Use method for proforma_id
    search_fields = ('proforma__proforma_id', 'client__client_name')  # Correct reference to ForeignKey field
    list_filter = ('paid', 'proforma__proforma_date')  # Correct related field access

    def get_proforma_id(self, obj):
        return obj.proforma.proforma_id if obj.proforma else "No Proforma"
    get_proforma_id.short_description = "Proforma ID"  # Custom column name in Django admin

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('item_id', 'item_name', 'quantity', 'reorder_level')
    search_fields = ('item_name',)
    list_filter = ('reorder_level',)
    
# Registering other models
admin.site.register(Clients)
admin.site.register(Projects)
admin.site.register(Personnel)
admin.site.register(AreaTypes)
admin.site.register(ProjectAssignmentAreaPersonnel)
admin.site.register(AreaStatus)
admin.site.register(ElevatorModels)
admin.site.register(ProjectStatus)
admin.site.register(Proformas)
admin.site.register(ProjectTypes)
admin.site.register(ElevatorConfigurations)
admin.site.register(Attachments)
admin.site.register(InventoryTransactions)
admin.site.register(MaintenanceRequests)
admin.site.register(MaintenanceLogs)
