var containerModule = function (md, name, options) {
      function validateDefault(params) {
        return params.trim().split(' ', 2)[0] === name;
      }
      function renderDefault(tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) 
          tokens[idx].attrJoin('class', name);
        return slf.renderToken(tokens, idx, _options, env, slf);
      }
      options = options || {};
      const min_markers = options.minMarkerCount || 3,
            marker_str  = options.marker || ':',
            end_marker_str  = options.endMarker || marker_str,
            end_marker_len = end_marker_str.length,
            marker_char = marker_str.charCodeAt(0),
            marker_len  = marker_str.length,
            validate    = options.validate || validateDefault,
            render      = options.render || renderDefault,
            customContent = !!options.content;
    
      function container(state, startLine, endLine, silent) {
        let pos, nextLine, marker_count, markup, params, token,
            old_parent, old_line_max,
            blockStart,
            auto_closed = false,
            start = blockStart = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];

        if (marker_char !== state.src.charCodeAt(start)) { return false; }
    
        for (pos = start + 1; pos <= max; pos++) {
          if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
            break;
          }
        }
    
        marker_count = Math.floor((pos - start) / marker_len);
        if (marker_count < min_markers) { return false; }
        pos -= (pos - start) % marker_len;
    
        markup = state.src.slice(start, pos);
        params = state.src.slice(pos, max);
        if (!validate(params, markup)) { return false; }
    
        if (silent) { return true; }
    
        const contentStart = max;
    
        nextLine = startLine;
    
        for (;;) {
          nextLine++;
          if (nextLine >= endLine) 
            break;
    
          start = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
    
          if (start < max && state.sCount[nextLine] < state.blkIndent)
            break;
    
          if (marker_char !== state.src.charCodeAt(start)) { continue; }
    
          if (state.sCount[nextLine] - state.blkIndent >= 4) 
            continue;
    
          for (pos = start + 1; pos <= max; pos++) {
            if (end_marker_str[(pos - start) % end_marker_len] !== state.src[pos]) {
              break;
            }
          }
    
          if (Math.floor((pos - start) / end_marker_len) < marker_count) { continue; }
    
          pos -= (pos - start) % end_marker_len;
          pos = state.skipSpaces(pos);
    
          if (pos < max) { continue; }
    
          auto_closed = true;
          break;
        }
    
        old_parent = state.parentType;
        old_line_max = state.lineMax;
        state.parentType = 'container';

        state.lineMax = nextLine;
    
        token        = state.push('container_' + name + '_open', 'div', 1);
        token.markup = markup;
        token.block  = true;
        token.info   = params;
        token.map    = [ startLine, nextLine ];
        token.position = blockStart;
        token.size = state.eMarks[nextLine] - blockStart;
    
        if (customContent) {
          token = state.push('container_' + name + '_content', 'div', 0);
          token.markup = state.src.slice(contentStart, start);
          token.block = true;
          token.position = contentStart;
          token.size = token.markup.length;
        } else {
          state.md.block.tokenize(state, startLine + 1, nextLine);
        }
    
        token        = state.push('container_' + name + '_close', 'div', -1);
        token.markup = state.src.slice(start, pos);
        token.block  = true;
        token.position = pos;
        token.size = 0;
    
        state.parentType = old_parent;
        state.lineMax = old_line_max;
        state.line = nextLine + (auto_closed ? 1 : 0);
    
        return true;
      }
    
      md.block.ruler.before('fence', 'container_' + name, container, {
        alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
      });
      md.renderer.rules['container_' + name + '_open'] = render;
      if (customContent) {
        md.renderer.rules['container_' + name + '_content'] = options.content;
      }
      md.renderer.rules['container_' + name + '_close'] = render;
    }
