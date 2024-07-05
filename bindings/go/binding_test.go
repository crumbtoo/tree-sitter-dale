package tree_sitter_dale_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-dale"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_dale.Language())
	if language == nil {
		t.Errorf("Error loading Dale grammar")
	}
}
