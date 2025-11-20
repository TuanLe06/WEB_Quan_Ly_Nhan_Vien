const db = require('../config/database');

/**
 * Base Model class với các phương thức CRUD cơ bản
 * Có thể extend class này cho các model cụ thể
 */
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Lấy tất cả records
   */
  async findAll(conditions = {}) {
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      const params = [];

      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map(key => `${key} = ?`)
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
        params.push(...Object.values(conditions));
      }

      const [rows] = await this.db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy một record theo ID
   */
  async findById(id, idColumn = 'id') {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE ${idColumn} = ?`;
      const [rows] = await this.db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo record mới
   */
  async create(data) {
    try {
      const fields = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
      const [result] = await this.db.query(query, values);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật record
   */
  async update(id, data, idColumn = 'id') {
    try {
      const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];

      const query = `UPDATE ${this.tableName} SET ${fields} WHERE ${idColumn} = ?`;
      const [result] = await this.db.query(query, values);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa record
   */
  async delete(id, idColumn = 'id') {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE ${idColumn} = ?`;
      const [result] = await this.db.query(query, [id]);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Soft delete (cập nhật trạng thái)
   */
  async softDelete(id, idColumn = 'id', statusColumn = 'trang_thai') {
    try {
      const query = `UPDATE ${this.tableName} SET ${statusColumn} = 0 WHERE ${idColumn} = ?`;
      const [result] = await this.db.query(query, [id]);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đếm số lượng records
   */
  async count(conditions = {}) {
    try {
      let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
      const params = [];

      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map(key => `${key} = ?`)
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
        params.push(...Object.values(conditions));
      }

      const [rows] = await this.db.query(query, params);
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Kiểm tra record tồn tại
   */
  async exists(id, idColumn = 'id') {
    try {
      const count = await this.count({ [idColumn]: id });
      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Pagination
   */
  async paginate(page = 1, limit = 10, conditions = {}) {
    try {
      const offset = (page - 1) * limit;
      
      let query = `SELECT * FROM ${this.tableName}`;
      const params = [];

      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map(key => `${key} = ?`)
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
        params.push(...Object.values(conditions));
      }

      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await this.db.query(query, params);
      const total = await this.count(conditions);

      return {
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Execute custom query
   */
  async query(sql, params = []) {
    try {
      const [rows] = await this.db.query(sql, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

/**
 * Specific models
 */
class Employee extends BaseModel {
  constructor() {
    super('NHANVIEN');
  }

  async findByDepartment(ma_phong) {
    return this.findAll({ ma_phong, trang_thai: 1 });
  }

  async findByPosition(ma_chucvu) {
    return this.findAll({ ma_chucvu, trang_thai: 1 });
  }
}

class Department extends BaseModel {
  constructor() {
    super('PHONGBAN');
  }
}

class Position extends BaseModel {
  constructor() {
    super('CHUCVU');
  }
}

class Attendance extends BaseModel {
  constructor() {
    super('CHAMCONG');
  }

  async findByEmployee(ma_nv, month, year) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ma_nv = ?
      AND MONTH(ngay_lam) = ?
      AND YEAR(ngay_lam) = ?
      ORDER BY ngay_lam DESC
    `;
    return this.query(query, [ma_nv, month, year]);
  }
}

class Salary extends BaseModel {
  constructor() {
    super('LUONG');
  }

  async findByEmployee(ma_nv, month, year) {
    return this.findAll({ ma_nv, thang: month, nam: year });
  }
}

class Leave extends BaseModel {
  constructor() {
    super('NGHIPHEP');
  }

  async findPending() {
    return this.findAll({ trang_thai: 'Chờ duyệt' });
  }
}

class Contract extends BaseModel {
  constructor() {
    super('HOPDONG');
  }

  async findByEmployee(ma_nv) {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE ma_nv = ?
      ORDER BY ngay_bat_dau DESC
    `;
    return this.query(query, [ma_nv]);
  }
}

class User extends BaseModel {
  constructor() {
    super('NGUOIDUNG');
  }

  async findByUsername(username) {
    return this.findById(username, 'username');
  }
}

// Export instances
module.exports = {
  BaseModel,
  Employee: new Employee(),
  Department: new Department(),
  Position: new Position(),
  Attendance: new Attendance(),
  Salary: new Salary(),
  Leave: new Leave(),
  Contract: new Contract(),
  User: new User()
};