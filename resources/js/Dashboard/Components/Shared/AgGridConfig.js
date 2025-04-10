import { AllCommunityModule, ModuleRegistry, themeBalham, } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
ModuleRegistry.registerModules([AllCommunityModule])
const gridTheme = themeBalham.withParams({
    spacing: 6,
    accentColor: "blue",
    wrapperBorder: false,
    headerHeight: 40,
});
const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    // editable: true,
}
export { AgGridReact, gridTheme, defaultColDef }