export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.contained = false;
    }

    add(other){
        return new Vector(this.x + other.x, this.y + other.y);
    }

    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    length() {
        return dist(this.x, this.y);
    }

    isZero() {
        return this.x === 0 && this.y === 0;
    }

    direction() {
        return this.scale(1. / this.length());
    }

    displacement(other){
        return new Vector(other.x - this.x, other.y - this.y);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    static Zero() {
        return new Vector(0, 0);
    }
}

class Triangle {
    constructor(vertices){
        if (vertices.length !== 3){
            throw new Error("Triangle not initialized with three vertices");
        }

        this.vertices = vertices;
    }

    contains(v) {
        const v0 = this.vertices[0];
        const v1 = v0.displacement(this.vertices[1]);
        const v2 = v0.displacement(this.vertices[2]);

        function det(u, v) {
            return u.x * v.y - u.y * v.x;
        }

        const a = (det(v, v2) - det(v0, v2)) / det(v1, v2);
        const b = -(det(v, v1) - det(v0, v1)) / det(v1, v2);

        return (a > 0 && b > 0) && (a + b) < 1;
    }

    perimeter() {
        const a = this.vertices[0].displacement(this.vertices[1]).length();
        const b = this.vertices[1].displacement(this.vertices[2]).length();
        const c = this.vertices[2].displacement(this.vertices[0]).length();

        return a + b + c;
    }

    area() {
        const a = this.vertices[0].displacement(this.vertices[1]).length();
        const b = this.vertices[1].displacement(this.vertices[2]).length();
        const c = this.vertices[2].displacement(this.vertices[0]).length();

        const p = (a + b + c) / 2;

        return Math.sqrt(p * (p - a) * (p - b) * (p - c));
    }
}


export class Polygon {
    constructor(vertices){
        this.vertices = vertices;
    }
}
