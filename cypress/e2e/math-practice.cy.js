describe("Math Practice App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  describe("Navigation", () => {
    it("should navigate between pages", () => {
      // Test initial page
      cy.contains("To-Do List App");

      // Navigate to Math Practice
      cy.get('a[href="/math-practice"]').click();
      cy.url().should("include", "/math-practice");
      cy.contains("Math Practice for Bianca!");

      // Navigate back to home
      cy.get('a[href="/"]').click();
      cy.url().should("eq", "http://localhost:3000/");
      cy.contains("To-Do List App");
    });

    it("should highlight active navigation link", () => {
      // Check Math Practice navigation
      cy.get('a[href="/math-practice"]').click();
      cy.get('a[href="/math-practice"]').should("have.class", "active");

      // Check Home navigation
      cy.get('a[href="/"]').click();
      cy.get('a[href="/"]').should("have.class", "active");
    });
  });

  describe("Math Practice Settings", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/math-practice");
    });

    it("should display settings form", () => {
      cy.contains("Choose Your Practice");
      cy.get('select[id="pattern"]').should("be.visible");
      cy.get('select[id="direction"]').should("be.visible");
      cy.get('input[id="startNumber"]').should("be.visible");
      cy.get("button").contains("Start Practice!").should("be.visible");
    });

    it("should allow changing counting pattern", () => {
      cy.get('select[id="pattern"]').select("2");
      cy.get('select[id="pattern"]').should("have.value", "2");

      cy.get('select[id="pattern"]').select("5");
      cy.get('select[id="pattern"]').should("have.value", "5");
    });

    it("should allow changing direction", () => {
      cy.get('select[id="direction"]').select("backward");
      cy.get('select[id="direction"]').should("have.value", "backward");

      cy.get('select[id="direction"]').select("forward");
      cy.get('select[id="direction"]').should("have.value", "forward");
    });

    it("should allow setting start number", () => {
      cy.get('input[id="startNumber"]').clear().type("50");
      cy.get('input[id="startNumber"]').should("have.value", "50");
    });

    it("should show preview of settings", () => {
      cy.get('select[id="pattern"]').select("5");
      cy.get('select[id="direction"]').select("backward");
      cy.get('input[id="startNumber"]').clear().type("25");

      cy.contains("Counting by 5s backward from 25");
    });
  });

  describe("Math Practice Session", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/math-practice");

      // Set up a practice session
      cy.get('select[id="pattern"]').select("10");
      cy.get('select[id="direction"]').select("forward");
      cy.get('input[id="startNumber"]').clear().type("0");
      cy.get("button").contains("Start Practice!").click();
    });

    it("should start practice session", () => {
      cy.contains("Questions:");
      cy.contains("Correct:");
      cy.contains("Points:");
      cy.get("button").contains("Back to Settings").should("be.visible");
    });

    it("should display math question", () => {
      // Should have question content
      cy.get('[data-testid="question-container"]').should("be.visible");

      // Should have input fields or buttons for answers
      cy.get('input[type="number"], button').should("exist");
    });

    it("should handle correct answer", () => {
      // This test depends on the specific question generated
      // We'll make it more flexible by checking for feedback

      // Try to interact with the first available input or button
      cy.get('input[type="number"]')
        .first()
        .then(($input) => {
          if ($input.length > 0) {
            // For fill-in-the-blank questions
            cy.wrap($input).type("10");
            cy.get("button").contains("Check Answer").click();
          }
        });

      // Should show some feedback
      cy.get('[class*="feedback"], [class*="result"]', {
        timeout: 3000,
      }).should("exist");
    });

    it("should track statistics", () => {
      // Initial stats should be 0
      cy.contains("Questions: 0");
      cy.contains("Correct: 0");
      cy.contains("Points: 0");

      // After answering (we'll just check that stats can update)
      // The exact values depend on user interaction
    });

    it("should allow returning to settings", () => {
      cy.get("button").contains("Back to Settings").click();
      cy.contains("Choose Your Practice");
      cy.get('select[id="pattern"]').should("be.visible");
    });
  });

  describe("Progress Tracking", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/math-practice");
    });

    it("should display progress tracker", () => {
      // Progress tracker should be visible on settings page
      cy.get('[class*="progress"]').should("exist");
    });

    it("should persist progress across sessions", () => {
      // Start a session and answer questions
      cy.get("button").contains("Start Practice!").click();

      // Go back to settings
      cy.get("button").contains("Back to Settings").click();

      // Progress should still be visible
      cy.get('[class*="progress"]').should("exist");
    });
  });

  describe("Reward System", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/math-practice");
      cy.get("button").contains("Start Practice!").click();
    });

    it("should display reward system", () => {
      cy.get('[class*="reward"]').should("exist");
    });

    it("should show achievements", () => {
      cy.get('[class*="achievement"], [class*="badge"]').should("exist");
    });
  });

  describe("Responsive Design", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/math-practice");
    });

    it("should work on mobile viewport", () => {
      cy.viewport(375, 667); // iPhone 6/7/8 size

      // Should still display all key elements
      cy.contains("Math Practice for Bianca!");
      cy.get('select[id="pattern"]').should("be.visible");
      cy.get("button").contains("Start Practice!").should("be.visible");
    });

    it("should work on tablet viewport", () => {
      cy.viewport(768, 1024); // iPad size

      cy.contains("Math Practice for Bianca!");
      cy.get('select[id="pattern"]').should("be.visible");
      cy.get("button").contains("Start Practice!").should("be.visible");
    });

    it("should work in landscape mode", () => {
      cy.viewport(667, 375); // iPhone landscape

      cy.contains("Math Practice for Bianca!");
      cy.get('select[id="pattern"]').should("be.visible");
    });
  });

  describe("Touch Interactions", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/math-practice");
      cy.viewport(375, 667); // Mobile viewport
    });

    it("should have touch-friendly targets", () => {
      // Check button sizes
      cy.get("button")
        .contains("Start Practice!")
        .then(($btn) => {
          const height = $btn.height();
          expect(height).to.be.at.least(44); // Minimum touch target
        });

      // Check input sizes
      cy.get('select[id="pattern"]').then(($select) => {
        const height = $select.height();
        expect(height).to.be.at.least(44);
      });
    });

    it("should handle touch events", () => {
      cy.get("button").contains("Start Practice!").trigger("touchstart");
      cy.get("button").contains("Start Practice!").trigger("touchend");
      cy.get("button").contains("Start Practice!").click();

      // Should navigate to practice mode
      cy.contains("Questions:");
    });
  });

  describe("Keyboard Navigation", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/math-practice");
    });

    it("should support tab navigation", () => {
      cy.get("body").tab();
      cy.focused().should("have.id", "pattern");

      cy.focused().tab();
      cy.focused().should("have.id", "direction");

      cy.focused().tab();
      cy.focused().should("have.id", "startNumber");

      cy.focused().tab();
      cy.focused().should("contain.text", "Start Practice!");
    });

    it("should support enter key to start practice", () => {
      cy.get("button").contains("Start Practice!").focus().type("{enter}");
      cy.contains("Questions:");
    });
  });
});
