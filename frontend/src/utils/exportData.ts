export const exportToJSON = (filename: string, data: any) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToSVG = (filename: string, svgContent: string) => {
    // Basic SVG wrapper if content isn't a full SVG
    let finalSvg = svgContent;
    if (!svgContent.includes('<svg')) {
        finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
            <!-- Auto-generated SVG Export -->
            ${svgContent}
        </svg>`;
    }
    const blob = new Blob([finalSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToDXF = (filename: string, data: any) => {
    // Mock DXF generation for demonstration
    // A real DXF exporter would parse polygons into LINE / POLYLINE entities.
    const dxfHeader = `0
SECTION
2
HEADER
0
ENDSEC
0
SECTION
2
ENTITIES
`;
    const dxfFooter = `0
ENDSEC
0
EOF`;

    // Dummy lines just to have a valid file structure for testing
    const dxfBody = `0
LINE
8
0
10
0.0
20
0.0
30
0.0
11
100.0
21
100.0
31
0.0
`;
    const finalDxf = dxfHeader + dxfBody + dxfFooter;
    const blob = new Blob([finalDxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.dxf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToIFC = (filename: string, data: any) => {
    // Mock IFC generation for demonstration
    // A real IFC exporter would generate complex EXPRESS schema text.
    const ifcContent = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'), '2;1');
FILE_NAME('${filename}.ifc', '${new Date().toISOString()}', ('Admin'), ('System'), 'IfcOpenShell', 'IfcOpenShell', '');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCPROJECT('1',#2,'ARCHE Project',$,$,$,$,$,#3);
#2=IFCOWNERHISTORY(#4,#5,$,.ADDED.,$,$,$,1234567890);
ENDSEC;
END-ISO-10303-21;`;

    const blob = new Blob([ifcContent], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.ifc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
