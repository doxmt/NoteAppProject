import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import PDFReader from 'react-native-pdf';
import * as FileSystem from 'expo-file-system';

export default function PdfViewer() {
  const { id } = useLocalSearchParams();
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdfPath = async () => {
      try {
        const folderPath = `${FileSystem.documentDirectory}notes/${id}.note/`;
        const metadataPath = `${folderPath}metadata.json`;
        const metadataJson = await FileSystem.readAsStringAsync(metadataPath);
        const metadata = JSON.parse(metadataJson);
        setPdfPath(metadata.pdfPath);
      } catch (err) {
        console.error('❌ PDF 경로 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPdfPath();
  }, [id]);

  if (loading || !pdfPath) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PDFReader source={{ uri: pdfPath }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
