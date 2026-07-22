class ServiceManager {
	constructor() {
		this.services = new Map();
	}

	/**
	 * تسجيل خدمة
	 * @param {String} name
	 * @param {Object} instance
	 */
	register(name, instance) {
		if (!name)
			throw new Error("اسم الخدمة مطلوب");

		if (this.services.has(name))
			throw new Error(`الخدمة "${name}" مسجلة مسبقًا`);

		this.services.set(name, instance);

		return instance;
	}

	/**
	 * الحصول على خدمة
	 * @param {String} name
	 */
	get(name) {
		if (!this.services.has(name))
			throw new Error(`الخدمة "${name}" غير موجودة`);

		return this.services.get(name);
	}

	/**
	 * هل الخدمة موجودة؟
	 */
	has(name) {
		return this.services.has(name);
	}

	/**
	 * حذف خدمة
	 */
	remove(name) {
		return this.services.delete(name);
	}

	/**
	 * إعادة تعيين جميع الخدمات
	 */
	clear() {
		this.services.clear();
	}

	/**
	 * قائمة الخدمات
	 */
	list() {
		return [...this.services.keys()];
	}

	/**
	 * عدد الخدمات
	 */
	size() {
		return this.services.size;
	}
}

module.exports = ServiceManager;
