import { defineStore } from 'pinia'
import {
	currentUserId, users, notes as mockNotes, comments as mockComments,
	conversations as mockConversations, messages as mockMessages,
	getUserById
} from '@/mock/data.js'
import { uid } from '@/utils/index.js'

export const useAppStore = defineStore('app', {
	state: () => ({
		currentUser: getUserById(currentUserId),
		users: [...users],
		notes: [...mockNotes],
		comments: [...mockComments],
		messages: [...mockMessages],
		conversations: mockConversations.map(c => ({ ...c, list: [...c.list] })),
		likedIds: [],
		collectedIds: [],
		followingIds: ['u1', 'u2', 'u5'],
		searchHistory: ['春日穿搭', '云南旅行', '减脂餐'],
		unreadMessageCount: 3,
		activeTab: 'discover'
	}),
	getters: {
		isLiked: (s) => (id) => s.likedIds.includes(id),
		isCollected: (s) => (id) => s.collectedIds.includes(id),
		isFollowing: (s) => (id) => s.followingIds.includes(id),
		getNote: (s) => (id) => s.notes.find(n => n.id === id),
		getUser: (s) => (id) => s.users.find(u => u.id === id) || s.users[0],
		getComments: (s) => (noteId) => s.comments.filter(c => c.noteId === noteId),
		userNotes: (s) => (userId) => s.notes.filter(n => n.userId === userId),
		likedNotes: (s) => s.notes.filter(n => s.likedIds.includes(n.id)),
		collectedNotes: (s) => s.notes.filter(n => s.collectedIds.includes(n.id))
	},
	actions: {
		toggleLike(id) {
			const i = this.likedIds.indexOf(id)
			const note = this.getNote(id)
			if (i > -1) {
				this.likedIds.splice(i, 1)
				if (note) note.likes = Math.max(0, note.likes - 1)
			} else {
				this.likedIds.push(id)
				if (note) note.likes += 1
			}
		},
		toggleCollect(id) {
			const i = this.collectedIds.indexOf(id)
			const note = this.getNote(id)
			if (i > -1) {
				this.collectedIds.splice(i, 1)
				if (note) note.collects = Math.max(0, note.collects - 1)
			} else {
				this.collectedIds.push(id)
				if (note) note.collects += 1
			}
		},
		toggleFollow(id) {
			const i = this.followingIds.indexOf(id)
			if (i > -1) {
				this.followingIds.splice(i, 1)
				const u = this.getUser(id); if (u) u.followers = Math.max(0, u.followers - 1)
			} else {
				this.followingIds.push(id)
				const u = this.getUser(id); if (u) u.followers += 1
			}
		},
		addComment(noteId, content, replyTo = null) {
			const c = {
				id: uid('c'), noteId, userId: this.currentUser.id, content,
				createTime: Date.now(), likes: 0, replies: []
			}
			if (replyTo) {
				const parent = this.comments.find(x => x.id === replyTo.id)
				if (parent) { parent.replies.push(c); return c }
			}
			this.comments.unshift(c)
			const note = this.getNote(noteId)
			if (note) note.commentsCount += 1
			return c
		},
		publishNote({ title, desc, tags, images, type = 'image' }) {
			const note = {
				id: uid('n'), userId: this.currentUser.id, title, desc, tags,
				images: images.length ? images : ['https://picsum.photos/seed/newpost/400/540'],
				type, videoUrl: '', likes: 0, collects: 0, commentsCount: 0,
				createTime: Date.now(), location: this.currentUser.location,
				ipLocation: this.currentUser.location
			}
			this.notes.unshift(note)
			return note
		},
		sendMessage(convId, content) {
			const conv = this.conversations.find(c => c.id === convId)
			if (conv) conv.list.push({ id: uid('cm'), from: this.currentUser.id, content, createTime: Date.now() })
		},
		clearUnread(convId) {
			const conv = this.conversations.find(c => c.id === convId)
			if (conv) conv.unread = 0
			this.unreadMessageCount = this.conversations.reduce((s, c) => s + c.unread, 0)
		},
		addSearchHistory(keyword) {
			const i = this.searchHistory.indexOf(keyword)
			if (i > -1) this.searchHistory.splice(i, 1)
			this.searchHistory.unshift(keyword)
			this.searchHistory = this.searchHistory.slice(0, 10)
		},
		clearSearchHistory() { this.searchHistory = [] },
		updateProfile(patch) { Object.assign(this.currentUser, patch) }
	}
})
