'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadFile, useUploads } from '@/hooks';
import { Download, FileText, Upload } from 'lucide-react';
import React, { useState } from 'react';

const UploadTest: React.FC = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [fileName, setFileName] = useState('');
	const {
		uploadFile,
		isLoading: uploadLoading,
		error: uploadError,
	} = useUploadFile();
	const {
		uploads,
		fetchUploads,
		isLoading: fetchLoading,
		error: fetchError,
	} = useUploads();

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type === 'application/pdf') {
			setSelectedFile(file);
			if (!fileName) {
				setFileName(file.name.replace('.pdf', ''));
			}
		} else {
			alert('Vui lòng chọn file PDF');
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			alert('Vui lòng chọn file');
			return;
		}

		const result = await uploadFile({
			file: selectedFile,
			fileName: fileName || undefined,
		});

		if (result.success) {
			alert('Upload thành công!');
			setSelectedFile(null);
			setFileName('');
			// Refresh uploads list
			fetchUploads();
		} else {
			alert(`Upload thất bại: ${result.error}`);
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<h2 className="text-2xl font-bold mb-6">Test Uploads Module</h2>

			{/* Upload Section */}
			<div className="mb-8 p-4 bg-gray-50 rounded-lg">
				<h3 className="text-lg font-semibold mb-4">Upload File PDF</h3>

				<div className="space-y-4">
					<div>
						<Label htmlFor="file">Chọn file PDF</Label>
						<Input
							id="file"
							type="file"
							accept=".pdf"
							onChange={handleFileSelect}
							className="mt-1"
						/>
					</div>

					<div>
						<Label htmlFor="fileName">Tên file (tùy chọn)</Label>
						<Input
							id="fileName"
							type="text"
							value={fileName}
							onChange={(e) => setFileName(e.target.value)}
							placeholder="Nhập tên file..."
							className="mt-1"
						/>
					</div>

					{selectedFile && (
						<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="flex items-center space-x-2">
								<FileText className="w-4 h-4 text-blue-600" />
								<span className="text-sm font-medium">{selectedFile.name}</span>
							</div>
							<p className="text-xs text-gray-600 mt-1">
								Kích thước: {formatFileSize(selectedFile.size)}
							</p>
						</div>
					)}

					<Button
						onClick={handleUpload}
						disabled={!selectedFile || uploadLoading}
						className="w-full"
					>
						{uploadLoading ? (
							<>Đang upload...</>
						) : (
							<>
								<Upload className="w-4 h-4 mr-2" />
								Upload File
							</>
						)}
					</Button>

					{uploadError && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
							{uploadError}
						</div>
					)}
				</div>
			</div>

			{/* Uploads List Section */}
			<div className="mb-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">Danh sách Files</h3>
					<Button
						onClick={fetchUploads}
						disabled={fetchLoading}
						variant="outline"
						size="sm"
					>
						{fetchLoading ? 'Đang tải...' : 'Refresh'}
					</Button>
				</div>

				{fetchError && (
					<div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4">
						{fetchError}
					</div>
				)}

				{uploads.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>Chưa có file nào được upload</p>
					</div>
				) : (
					<div className="space-y-3">
						{uploads.map((upload) => (
							<div
								key={upload.id}
								className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h4 className="font-medium text-gray-900">
											{upload.originalName}
										</h4>
										<p className="text-sm text-gray-600">Slug: {upload.slug}</p>
										<p className="text-xs text-gray-500">
											Kích thước: {formatFileSize(upload.fileSize)} | Ngày tạo:{' '}
											{new Date(upload.createdAt).toLocaleDateString('vi-VN')}
										</p>
									</div>
									<div className="flex items-center space-x-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												const url = `${
													process.env.NEXT_PUBLIC_API_URL ||
													'http://localhost:3001/api'
												}/uploads/f/${upload.fileName}`;
												window.open(url, '_blank');
											}}
										>
											<Download className="w-4 h-4" />
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												window.open(`/books/${upload.slug}/view`, '_blank');
											}}
										>
											<FileText className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default UploadTest;
