import { useState, useCallback } from 'react';
import { XMLBuilder } from 'fast-xml-parser';


//export option for XML
interface ExportOptions {
  filename?: string;
  rootElement?: string;
  itemElement?: string;
  includeMetadata?: boolean; 
  companyName?: string;       
  exportedBy?: string;         
  version?: string;           
}


//XML type structure
interface XMLStructure {
  '?xml': {
    '@_version': string;
    '@_encoding': string;
  };
  [key: string]: unknown;
}

export function useExportXML<T>() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToXML = useCallback(
    (data: T[], options?: ExportOptions) => {
      const {
        //default value
        filename = `export_${new Date().toISOString().split('T')[0]}.xml`,
        rootElement = 'Employees',   
        itemElement = 'Employee',     
        includeMetadata = true,      
        companyName = 'InfoMinds',    
        exportedBy = 'Fabio_Curci',   
        version = '1.0',            
      } = options || {};

      if (!data || data.length === 0) {
        setError('Nessun dato da esportare');
        return;
      }

      setIsExporting(true);
      setError(null);

      try {
        const builder = new XMLBuilder({
          format: true,
          ignoreAttributes: false,
          suppressEmptyNode: true,
        });

        const xmlData: XMLStructure = {
          '?xml': {
            '@_version': '1.0',
            '@_encoding': 'UTF-8',
          },
        };

        if (includeMetadata) {
          xmlData.Export = {
            Metadata: {
              ExportDate: new Date().toISOString(),
              ExportedBy: exportedBy,
              RecordCount: data.length,
              Version: version,
              Company: companyName,
              Generator: 'ERP System v1.0',
            },
            [rootElement]: {
              '@_count': data.length,
              [itemElement]: data,
            },
          };
        } else {
          xmlData[rootElement] = {
            [itemElement]: data,
          };
        }

        const xmlString = builder.build(xmlData);

        //download file
        const blob = new Blob([xmlString], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error in export');
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportToXML, isExporting, error };
}