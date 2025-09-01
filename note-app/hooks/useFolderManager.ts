// hooks/useFolderManager.ts
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getUserId } from '../utils/auth';
import { API_BASE } from '@/utils/api';
import { Folder } from '@/types/folder';

export function useFolderManager() {
  

const [folders, setFolders] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState<number | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folderColor, setFolderColor] = useState<string>('#fff');
  const [colorEditMode, setColorEditMode] = useState(false);

  

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserIdAndFolders = async () => {
      const id = await getUserId();
      setUserId(id);
  
      if (id) {
        try {
          const res = await axios.get(`${API_BASE}/api/folders/list`, {
            params: { userId: id },
          });
  
          if (res.status === 200) {
            setFolders(res.data.folders); // 전체 폴더 데이터 저장
          }
        } catch (err: any) {
          console.error('폴더 불러오기 실패:', err.response?.data || err.message);
        }
      }
    };
  
    fetchUserIdAndFolders();
  }, []);
  
  
  

  const openCreateModal = () => {
    setEditMode(false);
    setFolderName('');
    setFolderModalVisible(true);
  };

  // hooks/useFolderManager.ts
  const createFolder = async () => {
    if (folderName.trim() === '') return;
  
    // ✅ 폴더 색상 지정이 없거나 기본값이면 회색으로 대체
    const colorToUse = folderColor && folderColor !== '#fff' ? folderColor : '#999';
  
    console.log('📦 createFolder() 호출됨');
    console.log('userId:', userId);
    console.log('folderName:', folderName);
  
    try {
      console.log('➡️ 폴더 생성 요청:', {
        userId,
        name: folderName,
        parentId: selectedFolderId,
        color: colorToUse,
      });
  
      const res = await axios.post(`${API_BASE}/api/folders/create`, {
        userId,
        name: folderName,
        parentId: selectedFolderId ?? null,
        color: colorToUse,
      });
  
      if (res.status === 201) {
        setFolders(prev => [...prev, res.data.folder]);
        setFolderName('');
        setFolderColor('#fff'); // 색상 초기화
        setFolderModalVisible(false);
        setSelectedFolderId(null);
      }
    } catch (error: any) {
      console.error('폴더 생성 실패:', error.response?.data || error.message);
    }
  };
  
  


  const deleteFolder = async (folderId: string) => {
    try {
      const res = await axios.post(`${API_BASE}/api/folders/delete`, { folderId });
  
      if (res.status === 200) {
        const updated = folders.filter(folder => folder._id !== folderId);
        setFolders(updated);
      }
    } catch (error: any) {
      console.error('폴더 삭제 실패:', error.response?.data || error.message);
    }
  
    setOptionsVisible(null);
  };
  
  

  const renameFolder = async () => {
    if (!folderName.trim() || !selectedFolderId) return;
  
    const targetFolder = folders.find(f => f._id === selectedFolderId);
    if (!targetFolder) return;
  
    try {
      const res = await axios.patch(`${API_BASE}/api/folders/rename`, {
        folderId: selectedFolderId,
        newName: folderName,
      });
  
      if (res.status === 200) {
        const updated = folders.map(folder =>
          folder._id === selectedFolderId ? { ...folder, name: folderName } : folder
        );
        setFolders(updated);
      }
  
    } catch (error: any) {
      console.error('이름 변경 실패:', error.response?.data || error.message);
    }
  
    setFolderName('');
    setSelectedFolderId(null);
    setEditMode(false);
    setFolderModalVisible(false);
  };
  
  
  const updateFolderColor = async (folderId: string, newColor: string) => {
    if (!folderId || !newColor) return;
  
    try {
      const res = await axios.patch(`${API_BASE}/api/folders/color`, {
        folderId,
        newColor,
      });
  
      if (res.status === 200) {
        const updated = folders.map(folder =>
          folder._id === folderId ? { ...folder, color: newColor } : folder
        );
        setFolders(updated);
        setFolderModalVisible(false);
        setEditMode(false);
        setColorEditMode(false);
        setSelectedFolderId(null);
        setFolderColor('#fff');
      }
    } catch (error: any) {
      console.error('색상 변경 실패:', error.response?.data || error.message);
    }
  
    setOptionsVisible(null);
    setFolderColor('#fff');
    setSelectedFolderId(null);
  };
  

  const moveFolder = async (sourceId: string, targetId: string) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/folders/move`, {
        folderId: sourceId,
        newParentId: targetId,
      });
  
      if (res.status === 200) {
        const updated = folders.map(folder =>
          folder._id === sourceId ? { ...folder, parentId: targetId } : folder
        );
        setFolders(updated);
      }
    } catch (error: any) {
      console.error('폴더 이동 실패:', error.response?.data || error.message);
    }
  };
  
  
  
  

  
  return {
    folders,
    folderName,
    setFolderName,
    folderModalVisible,
    setFolderModalVisible,
    optionsVisible,
    setOptionsVisible,
    selectedIndex,
    setSelectedIndex,
    editMode,
    setEditMode,
    openCreateModal,
    createFolder,
    deleteFolder,
    renameFolder,
    selectedFolderId,
    setSelectedFolderId,
    folderColor,
    setFolderColor,
    updateFolderColor,
    moveFolder
  };
  
}