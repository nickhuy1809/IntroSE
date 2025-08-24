import {
  styled
} from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Button from './Button';

function FolderModal({ isOpen, onClose, onSubmit, initialName = '', title }) {
  const [name, setName] = useState(initialName);

  // Cập nhật tên trong input khi modal được mở cho một folder khác
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      onClose(); // Tự động đóng modal sau khi submit
    } else {
      alert("Tên thư mục không được để trống!");
    }
  };

  // Kiểu dáng tạm thời cho modal, bạn có thể thay thế bằng styled-components
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
  const modalContentStyle = { background: 'white', padding: '20px', borderRadius: '8px', width: '300px' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
  const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nhập tên thư mục..."
            style={inputStyle}
            autoFocus
          />
          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Button group container
const ButtonGroup = styled("div")({
  display: "flex",
  flexDirection: "row",
  gap: "12px",
});

// Styled icon wrapper
const Icon = styled("svg")({
  width: "18px",
  height: "18px",
  fill: "white",
});

function EditButtonGroup({ onAddSubfolder, onEdit, onDelete }) {
  return (
    <ButtonGroup>
      <button
      onClick={(e) => { e.stopPropagation(); onAddSubfolder(); }}
      style={{
        all: 'unset',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        }}
        >
        <Icon as="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3.75V14.25M3.75 9H14.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </Icon>
      </button>
      <button
      onClick={(e) => { e.stopPropagation(); onEdit(); }}
      style={{
        all: 'unset',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <Icon as="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5.25V3H15V5.25M6.75 15H11.25M9 3V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </Icon>
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      style={{
        all: 'unset',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <Icon as="svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    </button>
    </ButtonGroup>
  );
}

const FolderButton1 = styled("div")(({ isActive }) => ({
  backgroundColor: isActive ? `#aead5eff` : `rgba(88, 129, 95, 1)`,
  borderRadius: `20px`,
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  justifyContent: `flex-start`,
  alignItems: `center`,
  padding: `0px 10px`,
  boxSizing: `border-box`,
  height: `35px`,
  width: `325px`,
  cursor: `pointer`,
  transition: 'background-color 0.2s',
  '&:hover': {
      backgroundColor: isActive ? `rgba(255, 139, 73, 0.9)` : `rgba(88, 129, 95, 0.8)`,
  }
}));

const FolderName = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(248, 247, 227, 1)`,
  fontStyle: `normal`,
  fontFamily: `Exo`,
  fontWeight: `700`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `158px`,
  height: `35px`,
  margin: `0px 0px 0px 10px`,
  overflow: `hidden`,
  textOverflow: `clip`,
  flexGrow: 1, // Cho phép tên folder co giãn
});


function FolderButton({ folder, onClick, isActive, onAddSubfolder, onEdit, onDelete }) {
  return (
    <FolderButton1 onClick={onClick} isActive={isActive}>
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M24.0625 13.7084L10.9375 6.1396M4.76875 10.15L17.5 17.5146L30.2313 10.15M17.5 32.2V17.5M30.625 23.3334V11.6667C30.6245 11.1552 30.4895 10.6529 30.2335 10.21C29.9775 9.76723 29.6096 9.39951 29.1667 9.14377L18.9583 3.31044C18.5149 3.05445 18.012 2.91968 17.5 2.91968C16.988 2.91968 16.4851 3.05445 16.0417 3.31044L5.83333 9.14377C5.39038 9.39951 5.02247 9.76723 4.76651 10.21C4.51054 10.6529 4.37552 11.1552 4.375 11.6667V23.3334C4.37552 23.8448 4.51054 24.3472 4.76651 24.79C5.02247 25.2328 5.39038 25.6005 5.83333 25.8563L16.0417 31.6896C16.4851 31.9456 16.988 32.0804 17.5 32.0804C18.012 32.0804 18.5149 31.9456 18.9583 31.6896L29.1667 25.8563C29.6096 25.6005 29.9775 25.2328 30.2335 24.79C30.4895 24.3472 30.6245 23.8448 30.625 23.3334Z" stroke="#F8F7E3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <FolderName>
        {folder.name}
      </FolderName>
      <EditButtonGroup 
        onAddSubfolder={onAddSubfolder}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </FolderButton1>);
  }

const FolderManager1 = styled("div")({
  display: `flex`,
  position: `relative`,
  isolation: `isolate`,
  flexDirection: `row`,
  width: `623px`,
  height: `410px`,
  justifyContent: `flex-start`,
  alignItems: `flex-start`,
  padding: `0px`,
  boxSizing: `border-box`,
});

const Rectangle31 = styled("div")({
  backgroundColor: `#dbe5d1`,
  border: `5px solid #164a41`,
  boxSizing: `border-box`,
  width: `623px`,
  height: `360px`,
  position: `absolute`,
  left: `0px`,
  top: `50px`,
  padding: `5px`,
  flexDirection: 'column',
  display: 'flex',
  gap: '15px'
});

const Rectangle30 = styled("div")({
  backgroundColor: `#164a41`,
  borderRadius: `20px 20px 0px 0px`,
  width: `180px`,
  height: `52px`,
  position: `absolute`,
  left: `0px`,
  top: `0px`,
});

const Folders = styled("div")({
  textAlign: `center`,
  whiteSpace: `pre-wrap`,
  fontSynthesis: `none`,
  color: `rgba(248, 247, 227, 1)`,
  fontStyle: `normal`,
  fontFamily: `Exo`,
  fontWeight: `700`,
  fontSize: `24px`,
  letterSpacing: `0px`,
  textDecoration: `none`,
  textTransform: `none`,
  width: `110px`,
  height: `32px`,
  position: `absolute`,
  left: `51px`,
  top: `10px`,
});

const StyledFolderButton = styled(FolderButton)({
  width: `223px`,
  height: `35px`,
});

function FolderManager({ folders, selectedFolderId, onFolderSelect, onDataChange, isLoading, error }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('addRoot'); // 'addRoot', 'addSub', 'edit'
  const [currentTarget, setCurrentTarget] = useState(null); // Lưu folder cha (khi thêm con) hoặc folder đang sửa

  const accountId = localStorage.getItem('accountId');

  // --- HÀM XỬ LÝ SUBMIT TỪ MODAL (GỌI API) ---
  const handleSubmitModal = async (folderName) => {
    let url, method, body;

    switch (modalMode) {
      case 'addRoot':
        url = 'http://localhost:5000/api/folders';
        method = 'POST';
        body = { name: folderName, parentId: null };
        break;
      case 'addSub':
        url = 'http://localhost:5000/api/folders';
        method = 'POST';
        body = { name: folderName, parentId: currentTarget._id };
        break;
      case 'edit':
        url = `http://localhost:5000/api/folders/${currentTarget._id}`;
        method = 'PUT';
        body = { name: folderName };
        break;
      default:
        return;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-account-id': accountId },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Thao tác thất bại');
      onDataChange(); // Tải lại cây thư mục để cập nhật UI
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // --- HÀM XỬ LÝ XÓA (GỌI API) ---
  const handleDeleteFolder = async (folderId, folderName) => {
    if (window.confirm(`Bạn có chắc muốn xóa "${folderName}" không? Mọi thư mục con và khóa học bên trong cũng sẽ bị xóa.`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/folders/${folderId}`, {
          method: 'DELETE',
          headers: { 'x-account-id': accountId },
        });
        if (!response.ok) throw new Error('Không thể xóa thư mục');
        onDataChange();
      } catch (err) {
        alert(`Lỗi: ${err.message}`);
      }
    }
  };
  
  // --- CÁC HÀM MỞ MODAL ---
  const openModal = (mode, target = null) => {
    setModalMode(mode);
    setCurrentTarget(target);
    setIsModalOpen(true);
  };

  return (
    <>
      <FolderManager1>
        <div style={{ position: "absolute", top: "58px", left: "428px", zIndex: 2 }}>
          <Button onClick={() => openModal('addRoot')} label="+ New Folder"/>
        </div>
        
        <Rectangle31>
          {isLoading && <div>Đang tải...</div>}
          {error && <div>Lỗi: {error}</div>}
          {!isLoading && !error && folders.map((folder) => (
            <div key={folder._id}>
              {/* Render Folder Cha */}
              <FolderButton
                folder={folder}
                isActive={folder._id === selectedFolderId}
                onClick={() => onFolderSelect(folder._id)}
                onAddSubfolder={() => openModal('addSub', folder)}
                onEdit={() => openModal('edit', folder)}
                onDelete={() => handleDeleteFolder(folder._id, folder.name)}
              />
              {/* Render các Folder Con */}
              {folder.subfolders && folder.subfolders.length > 0 && (
                <div style={{ marginLeft: '30px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {folder.subfolders.map((subfolder) => (
                    <FolderButton
                      key={subfolder._id}
                      folder={subfolder}
                      isActive={subfolder._id === selectedFolderId}
                      onClick={() => onFolderSelect(subfolder._id)}
                      onAddSubfolder={() => alert("Không thể tạo thư mục con trong thư mục con.")}
                      onEdit={() => openModal('edit', subfolder)}
                      onDelete={() => handleDeleteFolder(subfolder._id, subfolder.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </Rectangle31>
        <Rectangle30>
        </Rectangle30>
        <Folders>
          {`Folders`}
        </Folders>
        <div style={{
          width: "35px",
          height: "35px",
          position: "absolute",
          left: "16px",
          top: "9px"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
            <path d="M32.0837 17.5H23.3337L20.417 21.875H14.5837L11.667 17.5H2.91699M32.0837 17.5V26.25C32.0837 27.0235 31.7764 27.7654 31.2294 28.3124C30.6824 28.8594 29.9405 29.1666 29.167 29.1666H5.83366C5.06011 29.1666 4.31824 28.8594 3.77126 28.3124C3.22428 27.7654 2.91699 27.0235 2.91699 26.25V17.5M32.0837 17.5L27.0524 7.45206C26.8109 6.96613 26.4387 6.55719 25.9776 6.27122C25.5164 5.98525 24.9846 5.8336 24.442 5.83331H10.5587C10.016 5.8336 9.48425 5.98525 9.0231 6.27122C8.56195 6.55719 8.18971 6.96613 7.94824 7.45206L2.91699 17.5" stroke="#F8F7E3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </FolderManager1>
      <FolderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialName={modalMode === 'edit' && currentTarget ? currentTarget.name : ''}
        title={
          modalMode === 'addRoot' ? 'Tạo thư mục mới' :
          modalMode === 'addSub' ? `Tạo thư mục con cho "${currentTarget?.name}"` :
          'Đổi tên thư mục'
        }
      />
    </>
  );
}

export default FolderManager;

  